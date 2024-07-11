const { EmbedBuilder, Embed, Client } = require("discord.js");
const { name, version, repository, logo } = require("../../package.json");
const logger = require("./logger");

class Author {
    /**
     * @param {string} name
     * @param {string} iconURL
     * @param {string} url
     */
    constructor(name, iconURL, url) {
        this.name = name;
        this.iconURL = iconURL;
        this.url = url;
    }
}

let botAuthor;

/**
 * Initialize the bot author
 * @param {Client} client 
 */
function initBotAuthor(client) {
    botAuthor = new Author(
        `${client.user.username} v${version}`,
        client.user.avatarURL(),
        repository.url.includes('+') ? repository.url.split('+')[1] : repository.url,
    );
}

/**
 * Create a new embed
 * @param {string} title
 * @param {string} description
 * @param {number} color
 * @param {Author} author
 * @returns {EmbedBuilder}
 */
function msg(title, description, color = 0x7289DA, author = botAuthor) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(description)
        .setAuthor(author);
    if (title)
        embed.setTitle(title);
    return embed;
}

/**
 * Create a new embed
 * @param {string} title
 * @param {string} description
 * @param {Author} author
 * @returns {EmbedBuilder}
 */
function errorMsg(title, description, author = botAuthor) {
    return msg(title, description, 0xFF0000, author);
}

module.exports = {
    Author,
    initBotAuthor,
    msg,
    errorMsg,
}