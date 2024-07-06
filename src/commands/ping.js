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
        interaction.reply("Pong !");
    },
    async messageExecute(message) {
        message.channel.send("Pong !");
    }
};