const { Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { msg, errorMsg } = require('../utils/embedUtility.js');
const { getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const logger = require('../utils/logger');

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