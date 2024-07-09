const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js');
const { getDictionary } = require("../utils/dictionary");
const { errorMsg, msg } = require('../utils/embeds');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDMPermission(true)
        .setDescription("Get an invite link to add the bot to your server"),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
        if (!process.env.INVITE_LINK) {
            logger.warn("Invite was called but INVITE_LINK is missing!");
            await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.invite.errors.no_link)], ephemeral: true });
        } else {
            await interaction.editReply({ embeds: [msg(dictionary.commands.invite.title, process.env.INVITE_LINK)], ephemeral: false})
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
        await interaction.deleteReply();
    },
};