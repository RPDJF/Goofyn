const { Interaction, SlashCommandBuilder } = require('discord.js');
const { getDictionary } = require("../utils/dictionary");
const { errorMsg, msg } = require('../utils/embedUtility');
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
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}`;

        const title = dictionary.commands.invite.title;
        const description = `[${dictionary.commands.invite.description}](${inviteLink})`;
        const embed = msg(title, description);
        embed.setThumbnail(interaction.client.user.avatarURL());
        await interaction.editReply({ embeds: [embed], ephemeral: false})
    },
};