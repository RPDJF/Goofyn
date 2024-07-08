const { Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
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