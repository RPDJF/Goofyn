const { Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { langCode, getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const { errorMsg, msg } = require('../utils/embedUtility.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setDMPermission(true)
        .setDescription("Change bot language")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => {
            option.setName("language")
                .setDescription("The language you want to use")
                .setRequired(true);
            const choices = Object.keys(langCode).map(lang => [{name:langCode[lang].data.name, value:lang}]);
            for (const choice of choices) {
                if (choice[0].value === "default")
                    continue;
                option.addChoices(...choice);
            }
            return option;
        }),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        let lang = interaction.guild ? await db.getData("guilds", interaction.guildId).lang : await db.getData("users", interaction.user.id).lang;
        const newLang = interaction.options.getString("language");
        let dictionary;
        if (langCode[newLang] === undefined) {
            dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
            await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.language.errors.invalid)], ephemeral: true});
        } else {
            if (lang !== newLang)
                await db.writeData(interaction.guild ? "guilds" : "users", interaction.guild ? interaction.guildId : interaction.user.id, { lang: newLang });
            dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
            await interaction.editReply({ embeds: [msg(dictionary.success, dictionary.commands.language.success, dictionary.author)], ephemeral: true});
        }
        await new Promise(resolve => setTimeout(resolve, 10000)).then(async() => await interaction.deleteReply());
        return;
    },
};