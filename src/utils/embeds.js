const { EmbedBuilder, Embed } = require("discord.js");
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

const botAuthor = new Author(`${name.charAt(0).toUpperCase()}${name.slice(1)} v${version}`, logo.url, repository.url.split('+')[1]);

function msg(title, description, color = 0x7289DA, author = botAuthor) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setAuthor(author);
    return embed;
}

function errorMsg(title, description, author = botAuthor) {
    return msg(title, description, 0xFF0000, author);
}

module.exports = {
    Author,
    msg,
    errorMsg,
}