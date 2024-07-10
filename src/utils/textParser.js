const { Interaction, GuildMember, Message } = require('discord.js');
const logger = require('./logger');

/**
 * Parse variables and special characters in the text
 * @param {Interaction | Message | GuildMember} context
 * @param {String} text
 * @returns {Promise<String>}
 */
async function textParser(context, text) {
    if (!text) return text;

    let output = text;

    // First parse the async variables
    if (text.includes("{membercount}")) {
        const memberCount = context.guild ? (await context.guild.members.fetch()).size : "undefined";
        output = output.replace(/{membercount}/g, memberCount);
    }
    if (text.includes("{rolecount}")) {
        const roleCount = context.guild ? (await context.guild.roles.fetch()).size : "undefined";
        output = output.replace(/{rolecount}/g, roleCount);
    }

    output = output
        .replace(/{user}/g, `<@${context.user ? context.user.id : context.author.id}>`)
        .replace(/{username}/g, context.user ? context.user.username : context.author.username)
        .replace(/{userid}/g, context.user ? context.user.id : context.author.id)
        .replace(/{guild}/g, context.guild ? context.guild.name : "undefined")
        .replace(/{channel}/g, context.channelId ? `<#${context.channelId}>` : "undefined")
        .replace(/{bot}/g, `<@${context.client.user.id}>`)
        .replace(/{botname}/g, context.client.user.username)
        .replace(/\\n/g, "\n")
        .replace(/{backslash}/g, "\\");
    return output;
}

module.exports = { textParser };