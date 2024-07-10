const { Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { msg, errorMsg } = require('../utils/embedUtility');
const { getDictionary } = require("../utils/dictionary");
const { textParser } = require("../utils/textParser");
const db = require("../utils/db");
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDescription("Manage bot messages")
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Create a new message")
                .addStringOption(option =>
                    option
                        .setName("message")
                        .setDescription("The message to send")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("edit")
                .setDescription("Edit a message")
                .addStringOption(option =>
                    option
                        .setName("message_id")
                        .setDescription("The message ID")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("message")
                        .setDescription("The message to send")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("Delete a message")
                .addStringOption(option =>
                    option
                        .setName("message_id")
                        .setDescription("The message ID")
                        .setRequired(true)
                )
        ),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });

        if (subcommand === "new") {
            const message = await textParser(interaction, interaction.options.getString("message"));
            
            await interaction.channel.send(message);
            
            const title = dictionary.commands.message.title.new;
            const description = dictionary.commands.message.success.msg_created;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
            return;
        }

        else if (subcommand === "edit") {
            const messageID = interaction.options.getString("message_id");
            const message = await textParser(interaction, interaction.options.getString("message"));
            
            const messageToEdit = await interaction.channel.messages.fetch(messageID);
            if (!messageToEdit) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.message.errors.msg_not_found;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
                return;
            } else if (messageToEdit.author.id !== interaction.client.user.id) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.message.errors.msg_not_bot;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
                return;
            }
            
            await messageToEdit.edit(message);

            const title = dictionary.commands.message.title.edit;
            const description = dictionary.commands.message.success.msg_edited;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
            return;
        }

        else if (subcommand === "delete") {
            const messageID = interaction.options.getString("message_id");
            
            const messageToDelete = await interaction.channel.messages.fetch(messageID);
            if (!messageToDelete) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.message.errors.msg_not_found;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
                return;
            } else if (messageToDelete.author.id !== interaction.client.user.id) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.message.errors.msg_not_bot;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
                return;
            }
            
            await messageToDelete.delete();

            const title = dictionary.commands.message.title.delete;
            const description = dictionary.commands.message.success.msg_deleted;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
            return;
        }
    },
};