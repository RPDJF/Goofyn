const { Interaction, Message, SlashCommandBuilder } = require('discord.js');
const { getDictionary } = require('../utils/dictionary');
const { Author } = require('../utils/embedUtility');
const { msg } = require('../utils/embedUtility');
const logger = require('../utils/logger');

// nasty import since Jikan.js is not yet published to npm and not even officially supported in node.js
const { JikanClient } = require("../../modules/Jikan.js/npm/script/mod");

const jikanClient = new JikanClient();

jikanClient.ge

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search_character")
        .setDMPermission(true)
        .setDescription("Search for an anime character")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Name of the character")
                .setRequired(true)),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        const query = {
            limit: 1,
            q: interaction.options.getString("name"),
            order_by: 'favorites',
            sort: 'desc',
        };
        await interaction.deferReply({ephemeral: false});
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
        try {
            const character = await jikanClient.getCharacterFull((await jikanClient.getCharacters(query))[0].mal_id);
            logger.info(`Jikan.js library request by ${interaction.user.id}`);
            const author = new Author("Jikan.js", interaction.client.user.avatarURL(), "https://github.com/RPDJF/Jikan.js.git");
            const title = character.name;
            const description = (character.about ? character.about.length > 700 ? character.about.substring(0, 700) + "..." : character.about : "No description available") + "\n\n" + character.favorites + " ❤️";
            const embed = msg(title, description, undefined, author);
            embed.setImage(character.images.jpg.image_url);
            embed.setURL(character.url);
            /*embed.addFields([{
                    name: "Aliases",
                    value: character.nicknames.join(", ") || "No aliases available",
                }, {
                    name: "Favorites",
                    value: character.
                }]);*/
            await interaction.editReply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            logger.error(error);
            await interaction.editReply(dictionary.commands.jikanjs.errors.oops);
        }
    },
};