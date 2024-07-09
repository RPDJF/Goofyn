const { Interaction, SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const { msg, errorMsg } = require('../utils/embedUtility.js');
const logger = require('../utils/logger');

// This command requires the function onGuildMemberAdd_hook to be called when a new member joins the server

/**
 * Clean up the data by removing roles that no longer exist
 * @param {Interaction} interaction
 * @param {Object} roles
 * @returns {Promise<Object>}
 */
async function cleanUpData(interaction, roles) {
    if (roles) {
        let triggered = false;
        const guildRoles = await interaction.guild.roles.fetch();
        for (const autorole of roles) {
            if (!guildRoles.has(autorole)) {
                roles = roles.filter(r => r !== autorole);
                triggered = true;
            }
        }
        if (triggered)
            await db.writeData("guilds", interaction.guildId, { autorole: roles }, true);
    }
    return roles;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autorole")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDescription("Add a role to new members")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a role to new members")
                .addRoleOption(option =>
                        option
                            .setName("role")
                            .setDescription("The role to add to new members")
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a role from new members")
                .addRoleOption(option =>
                        option
                            .setName("role")
                            .setDescription("The role to remove from new members")
                            .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List the roles added to new members")),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
        const subcommand = interaction.options.getSubcommand();
        let roles = (await db.getData("guilds", interaction.guildId)).autorole;

        // Check if the role exists, if not remove it from the autorole list
        roles = await cleanUpData(interaction, roles);

        // Execute the subcommands
        if (subcommand === "add") {
            const newRole = interaction.options.getRole("role").id;
            if (roles && !roles.includes(newRole)) {
                logger.info(`Adding role ${newRole} to autorole`);
                roles.push(interaction.options.getRole("role").id);
            }
            else if (!roles)
                roles = [newRole];
            else {
                await interaction.editReply({
                    embeds: [errorMsg(
                        dictionary.errors.title,
                        dictionary.commands.autorole.errors.already_added)],
                    ephemeral: true
                });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }
            await db.writeData("guilds", interaction.guildId, { autorole: roles }, true);
            await interaction.editReply({
                embeds: [msg(
                    dictionary.commands.autorole.title.add,
                    dictionary.commands.autorole.success.add.replace("{role}", newRole))],
                ephemeral: false
            });
        }

        else if (subcommand === "remove") {
            const removeRole = interaction.options.getRole("role").id;
            if (roles && roles.includes(removeRole)) {
                roles = roles.filter(role => role !== removeRole);
            } else {
                await interaction.editReply({
                    embeds: [errorMsg(
                        dictionary.errors.title,
                        dictionary.commands.autorole.errors.no_role)],
                    ephemeral: true
                });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }
            await db.writeData("guilds", interaction.guildId, { autorole: roles }, true);
            await interaction.editReply({
                embeds: [msg(
                    dictionary.commands.autorole.title.remove,
                    dictionary.commands.autorole.success.remove.replace("{role}", removeRole))],
                ephemeral: false
            });
        }

        else if (subcommand === "list") {
            if (roles && roles.length > 0) {
                let roleList = "";
                for (const role of roles) {
                    roleList += `- <@&${role}>\n`;
                }
                await interaction.editReply({
                    embeds: [msg(dictionary.commands.autorole.title.list, roleList)],
                    ephemeral: true });
                return;
            } else {
                await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.autorole.errors.empty_roles)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }
        }
    },

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Promise<void>}
     */
    async onGuildMemberAdd_hook(member) {
        const roles = (await db.getData("guilds", member.guild.id)).autorole;
        if (roles) {
            const availableRoles = await member.guild.roles.fetch();
            for (const role of roles) {
                if (availableRoles.has(role)) {
                    await member.roles.add(role).catch((err) => {
                        logger.error(err);
                    });
                }
            }
        }
    },
};