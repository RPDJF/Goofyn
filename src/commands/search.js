const { Interaction, Message, SlashCommandBuilder } = require("discord.js");
const { getDictionary } = require("../utils/dictionary");
const { Author } = require("../utils/embedUtility");
const { msg } = require("../utils/embedUtility");
const logger = require("../utils/logger");

// nasty import since Jikan.js is not yet published to npm and not even officially supported in node.js
const { JikanClient } = require("../../modules/Jikan.js/npm/script/mod");

const jikanClient = new JikanClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDMPermission(true)
    .setDescription("Search for MAL entries using Jikan.js")
    .addSubcommand((option) =>
      option
        .setName("character")
        .setDescription("Search for a character")
        .addStringOption((option) =>
          option.setName("name")
            .setDescription("🕺 Name of the character")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("anime")
        .setDescription("Search for an anime")
        .addStringOption((option) =>
          option.setName("name")
            .setDescription("🎞️ Name of the anime")
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("manga")
        .setDescription("Search for a manga")
        .addStringOption((option) =>
          option.setName("name")
            .setDescription("📚 Name of the manga")
            .setRequired(true)
        )
    ),

  /**
   * Instructions to execute
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const dictionary = await getDictionary(
      interaction.guildId
        ? { guildid: interaction.guildId }
        : { userid: interaction.user.id },
    );
    const subcommand = interaction.options.getSubcommand();

    try {
      const author = new Author(
        "RPDJF/Jikan.js (for Node.js)",
        "https://avatars.githubusercontent.com/u/86334233?v=4",
        "https://github.com/RPDJF/Jikan.js.git",
      );
      logger.info(`Jikan.js library request by ${interaction.user.id}`);
      if (subcommand === "character") {
        const characterQuery = await jikanClient.getCharacters({
          limit: 1,
          q: interaction.options.getString("name"),
          order_by: "favorites",
          sort: "desc",
        });
        if (!characterQuery.length) {
          await interaction.editReply(
            dictionary.commands.jikanjs.errors.oops,
          );
          return;
        }
        const character = await jikanClient.getCharacterFull(
          characterQuery[0].mal_id,
        );
        const title = character.name;
        const description = "## About\n" +
          (character.about
            ? character.about.length > 700
              ? character.about.substring(0, 700) + "..."
              : character.about
            : "No description available")
            .replace(/^([\w\s]+):/gm, "🔹 **$1**:");
        let voices = character.voices.length
          ? character.voices.map((voice) =>
            `**${voice.language}**: [${voice.person.name}](${voice.person.url})`
          ).join(", ")
          : null;
        if (voices && voices.length > 512) {
          voices = voices.substring(0, 512 - "...".length) + "...";
        }
        const embed = msg(title, description, undefined, author);
        embed.setImage(character.images.jpg.image_url);
        embed.setURL(character.url);
        embed.addFields(
          {
            name: "Favorites",
            value: `❤️ ${character.favorites}`,
            inline: false,
          },
          {
            name: "Aliases",
            value: character.nicknames.join(", ") || "No aliases available",
            inline: true,
          },
          voices
            ? {
              name: "Voices",
              value: voices,
              inline: true,
            }
            : {
              name: "Voices",
              value: "No voices available",
              inline: true,
            },
          {
            name: "More informations",
            value: `[See more on MyAnimeList](${character.url})`,
            inline: false,
          },
        );
        await interaction.editReply({ embeds: [embed], ephemeral: false });
      } else if (subcommand === "anime") {
        const animeQuery = await jikanClient.getAnimes({
          limit: 1,
          q: interaction.options.getString("name"),
          order_by: "favorites",
          sort: "desc",
          sfw: interaction.channel.nsfw ? "false" : "true",
        });
        if (!animeQuery.length) {
          await interaction.editReply(
            dictionary.commands.jikanjs.errors.oops,
          );
          return;
        }
        const anime = animeQuery[0];
        const title = anime.titles[0].title +
          (anime.year ? ` (${anime.year})` : "");
        const description = "## Synopsis\n" +
          (anime.synopsis
            ? anime.synopsis.length > 700
              ? `${anime.synopsis.substring(0, 700)}...`
              : anime.synopsis
            : "No description available");
        const embed = msg(title, description, undefined, author);
        embed.setImage(
          anime.images.jpg.large_image_url || anime.images.jpg.image_url,
        );
        embed.setURL(anime.url);
        console.log(anime.episodes);
        embed.addFields(
          {
            name: "Score",
            value: anime.score
              ? `${anime.score.toFixed(1).toString()}/10 ⭐`
              : "No score available",
            inline: false,
          },
          {
            name: "Genres",
            value: anime.genres.map((genre) => genre.name).join(", "),
            inline: true,
          },
          {
            name: "Episodes",
            value: anime.episodes
              ? anime.episodes.toString()
              : "No episodes available",
            inline: true,
          },
          {
            name: "Status",
            value: anime.status || "No status available",
            inline: true,
          },
          {
            name: "More informations",
            value: `[See more on MyAnimeList](${anime.url})`,
            inline: false,
          },
        );
        await interaction.editReply({ embeds: [embed], ephemeral: false });
      } else if (subcommand === "manga") {
        const mangaQuery = await jikanClient.getMangas({
          limit: 1,
          q: interaction.options.getString("name"),
          order_by: "favorites",
          sort: "desc",
          sfw: interaction.channel.nsfw ? "false" : "true",
        });
        if (!mangaQuery.length) {
          await interaction.editReply(
            dictionary.commands.jikanjs.errors.oops,
          );
          return;
        }
        const manga = mangaQuery[0];
        const title = manga.titles[0].title +
          (manga.year ? ` (${manga.year})` : "");
        const description = "## Synopsis\n" +
          (manga.synopsis
            ? manga.synopsis.length > 700
              ? `${manga.synopsis.substring(0, 700)}...`
              : manga.synopsis
            : "No description available");
        const embed = msg(title, description, undefined, author);
        embed.setImage(
          manga.images.jpg.large_image_url || manga.images.jpg.image_url,
        );
        embed.setURL(manga.url);
        embed.addFields(
          {
            name: "Score",
            value: manga.score
              ? `${manga.score.toFixed(1).toString()}/10 ⭐`
              : "No score available",
            inline: false,
          },
          {
            "name": "Authors",
            "value": manga.authors
              ? manga.authors.map((author) => `[${author.name}](${author.url})`)
                .join(
                  ", ",
                )
              : "No authors available",
            "inline": true,
          },
          {
            name: "Genres",
            value: manga.genres.map((genre) => genre.name).join(", "),
            inline: true,
          },
          {
            name: "Volumes",
            value: manga.volumes
              ? manga.volumes.toString()
              : "No volumes available",
            inline: true,
          },
          {
            name: "Chapters",
            value: manga.chapters
              ? manga.chapters.toString()
              : "No chapters available",
            inline: true,
          },
          {
            name: "Status",
            value: manga.status || "No status available",
            inline: true,
          },
          {
            name: "More informations",
            value: `[See more on MyAnimeList](${manga.url})`,
            inline: false,
          },
        );
        await interaction.editReply({ embeds: [embed], ephemeral: false });
      }
    } catch (error) {
      logger.error(error);
      await interaction.editReply(dictionary.commands.jikanjs.errors.oops);
    }
  },
};
