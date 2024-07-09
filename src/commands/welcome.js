const { Interaction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, GuildMember } = require('discord.js');
const { msg, errorMsg } = require('../utils/embeds');
const { getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDescription("Set up the welcome message and the welcome channel")
        .addSubcommand(subcommand =>
            subcommand
                .setName("enable")
                .setDescription("Enable or disable the welcome message")
                .addBooleanOption(option =>
                    option
                        .setName("enable")
                        .setDescription("Enable or disable the welcome message")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("help")
                .setDescription("Get help on how to set up the welcome message")
        )
        .addSubcommandGroup(group =>
            group
                .setName("set")
                .setDescription("Set the welcome message or the welcome channel")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("channel")
                        .setDescription("Set the welcome channel")
                        .addChannelOption(option =>
                            option
                                .setName("channel_id")
                                .setDescription("The channel where the welcome message will be sent")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("message")
                        .setDescription("Set the welcome message")
                        .addStringOption(option =>
                            option
                                .setName("message")
                                .setDescription("The welcome message")
                                .setRequired(true))
                        .addStringOption(option =>
                            option
                                .setName("thumbnail_url")
                                .setDescription("The URL of the thumbnail")
                                .setRequired(false))
                )
        ),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const dictionary = await getDictionary({ guildid: interaction.guildId });
        const subcommand = interaction.options.getSubcommand();
        const groupcommand = interaction.options.getSubcommandGroup();
        const welcomeDoc = (await db.getData("guilds", interaction.guildId)).welcome || { enabled: false, channel_id: null, message: null, thumbnail_url: null };
        let update = false;

        // Execute the subcommands
        if (!groupcommand) {
            if (subcommand === "enable") {
                const enable = interaction.options.getBoolean("enable");

                // Check if the channel and the message are set first
                if (!welcomeDoc.message || !welcomeDoc.channel_id) {
                    const title = dictionary.errors.title;
                    const description = dictionary.commands.welcome.errors.no_channel_or_message;
                    await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    interaction.deleteReply();
                    return;
                }

                if (enable !== welcomeDoc.enabled) {
                    welcomeDoc.enabled = enable;
                    update = true;
                }

                if (update)
                    await db.writeData("guilds", interaction.guildId, { welcome: welcomeDoc }, true);

                const title = enable ? dictionary.commands.welcome.title.enabled : dictionary.commands.welcome.title.disabled;
                const description = dictionary.commands.welcome.success.toggle.replace("{value}", enable);
                await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
                await new Promise(resolve => setTimeout(resolve, 10000));
                interaction.deleteReply();
                return;
            }

            else if (subcommand === "help") {
                const commandId = interaction.commandId;

                const title = dictionary.commands.welcome.title.help;
                const description = dictionary.commands.welcome.help.join('\n').replace(/{commandId}/g, commandId);
                interaction.editReply({ embeds: [msg(title, description)], ephemeral: false });
                return;
            }
        }

        // Execute the "set" group subcommands
        else if (groupcommand === "set") {
            if (subcommand === "channel") {
                const channel_id = interaction.options.getChannel("channel_id").id;

                // Check if the channel exists
                const channel = await interaction.guild.channels.fetch(channel_id);
                if (!channel || channel.type != ChannelType.GuildText) {
                    const title = dictionary.errors.title;
                    const description = dictionary.errors.invalid_channel;
                    await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    interaction.deleteReply();
                    return;
                }

                if (channel_id !== welcomeDoc.channel_id) {
                    welcomeDoc.channel_id = channel_id;
                    update = true;
                }

                if (update)
                    await db.writeData("guilds", interaction.guildId, { welcome: welcomeDoc }, true);
                
                const title = dictionary.commands.welcome.title.channel;
                const description = dictionary.commands.welcome.success.channel.replace("{channel}", channel_id);
                await interaction.editReply({ embeds: [msg(title, description)] });
                await new Promise(resolve => setTimeout(resolve, 10000));
                interaction.deleteReply();
                return ;
            }

            else if (subcommand === "message") {
                let message = interaction.options.getString("message");
                const thumbnail_url = interaction.options.getString("thumbnail_url");

                if (thumbnail_url && !thumbnail_url.match(/\.(jpeg|jpg|gif|png)$/)) {
                    const title = dictionary.errors.title;
                    const description = dictionary.commands.errors.invalid_thumbnail;
                    await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    interaction.deleteReply();
                    return;
                }

                if (message !== welcomeDoc.message || thumbnail_url !== welcomeDoc.thumbnail_url) {
                    welcomeDoc.message = message;
                    welcomeDoc.thumbnail_url = thumbnail_url;
                    update = true;
                }

                if (update)
                    await db.writeData("guilds", interaction.guildId, { welcome: welcomeDoc }, true);

                const title = dictionary.commands.welcome.title.message;
                const description = dictionary.commands.welcome.success.message;
                await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
                await new Promise(resolve => setTimeout(resolve, 10000));
                interaction.deleteReply();
                return;
            }
        }
    },

    /**
     * Function to execute when a member joins the server
     * @param {GuildMember} member
     * @returns {Promise<void>}
     */
    async onGuildMemberAdd_hook(member) {
        const guildDoc = await db.getData("guilds", member.guild.id);
        if (!guildDoc.welcome.enabled || !guildDoc.welcome.channel_id || !guildDoc.welcome.message)
            return;

        let message = guildDoc.welcome.message;
        message = message
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{guild}/g, member.guild.name)
            .replace(/{membercount}/g, (await member.guild.members.fetch()).size)
            .replace(/\\n/g, "\n");

        const channel = await member.guild.channels.fetch(guildDoc.welcome.channel_id);
        if (!channel || channel.type != ChannelType.GuildText)
            return;

        channel.send({ content: message, files: guildDoc.welcome.thumbnail_url ? [guildDoc.welcome.thumbnail_url] : [] });
    },
};