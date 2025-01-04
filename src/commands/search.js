const { Interaction, Message, SlashCommandBuilder } = require('discord.js');
const { getDictionary } = require('../utils/dictionary');
const { Author } = require('../utils/embedUtility');
const { msg } = require('../utils/embedUtility');
const logger = require('../utils/logger');

// nasty import since Jikan.js is not yet published to npm and not even officially supported in node.js
const { JikanClient } = require("../../modules/Jikan.js/npm/script/mod");

const jikanClient = new JikanClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDMPermission(true)
        .setDescription("Search for MAL entries using Jikan.js")
        .addSubcommand(option => option
            .setName("character")
            .setDescription("Search for a character")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("🕺 Name of the character")
                        .setRequired(true)),
        )
        .addSubcommand(option => option
            .setName("anime")
            .setDescription("Search for an anime")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("🎞️ Name of the anime")
                        .setRequired(true)),
        ),
        
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply({ephemeral: false});
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
        const subcommand = interaction.options.getSubcommand();

        try {
            const author = new Author("RPDJF/Jikan.js (for Node.js)", "https://avatars.githubusercontent.com/u/86334233?v=4", "https://github.com/RPDJF/Jikan.js.git");
            logger.info(`Jikan.js library request by ${interaction.user.id}`);
            if (subcommand === "character") {
                const character = await jikanClient.getCharacterFull((await jikanClient.getCharacters({
                    limit: 1,
                    q: interaction.options.getString("name"),
                    order_by: 'favorites',
                    sort: 'desc',
                }))[0].mal_id);
                const title = character.name;
                const description = ((character.about ? character.about.length > 700 ? character.about.substring(0, 700) + "..." : character.about : "No description available") + "\n\n" + character.favorites + " ❤️")
                    .replace(/^([\w\s]+):/gm, '- **$1**:');
                let voices = character.voices.length ? character.voices.map(voice => `**${voice.language}**: [${voice.person.name}](${voice.person.url})`).join(", ") : null;
                if (voices && voices.length > 1024) voices = voices.substring(0, 1024 - "...".length) + "...";
                const embed = msg(title, description, undefined, author);
                embed.setImage(character.images.jpg.image_url);
                embed.setURL(character.url);
                embed.addFields({
                    name: "Aliases",
                    value: character.nicknames.join(", ") || "No aliases available",
                }, voices? {
                    name: "Voices",
                    value: voices,
                } : {}, {
                    name: "More informations",
                    value: `[See more on MyAnimeList](${character.url})`,
                });
                await interaction.editReply({ embeds: [embed], ephemeral: false });
            } else if (subcommand === "anime") {
                const anime = await jikanClient.getAnimeFull((await jikanClient.getAnimes({
                    limit: 1,
                    q: interaction.options.getString("name"),
                    order_by: "favorites",
                    sort: "desc",
                }))[0].mal_id);
                const title = anime.titles[0].title + anime.year ? ` (${anime.year})` : "";
                const description = ((anime.synopsis ? anime.synopsis.length > 700 ? `${anime.synopsis.substring(0, 700)}...` : anime.synopsis : "No description available") + `\n\n${anime.score}/10 ⭐`);
                const embed = msg(title, description, undefined, author);
                embed.setImage(anime.images.jpg.large_image_url || anime.images.jpg.image_url);
                embed.setURL(anime.url);
                console.log(anime.episodes);
                embed.addFields({
                    name: "Genres",
                    value: anime.genres.map(genre => genre.name).join(", "),
                }, anime.episodes ? {
                    name: "Episodes",
                    value: anime.episodes.toString(),
                } : {}, anime.status ? {
                    name: "Status",
                    value: anime.status,
                } : {}, {
                    name: "More informations",
                    value: `[See more on MyAnimeList](${anime.url})`,
                };
                await interaction.editReply({ embeds: [embed], ephemeral: false });
            }
        } catch (error) {
            logger.error(error);
            await interaction.editReply(dictionary.commands.jikanjs.errors.oops);
        }
    },
};