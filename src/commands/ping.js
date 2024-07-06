const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDMPermission(true)
        .setDescription("Ping !"),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply("Pong !");
    },
};