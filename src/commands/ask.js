const { getGeminiContext, safetySettings, generationConfig, historySettings } = require('../../config/ask_gemini_conf');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, Message, Collection } = require('discord.js');
const { commands } = require('./commands');
const { langCode, languageData } = require('../utils/language');
const db = require("../utils/db");
const logger = require('../utils/logger');

// Requires API key to be set in environment variable GEMINI_API_KEY

/**
 * 
 * @param {Interaction} interaction
 * @returns {Promise<Array>}
 */
async function getHistory(interaction) {

    /** @type {Collection<String, Message>} */
    const messages = await interaction.channel.messages.fetch({
        limit: historySettings.maxMessages,
    }).catch(error => {
        logger.error(error);
        return [];
    });

    const history = [];
    messages.map(message => history.push({
        role: (message.author.id === interaction.client.user.id)?
            "model" : "user",
        parts: (message.author.id === interaction.client.user.id)?
            [{text:message.content}] : [{text:`<@${message.author.id}>:${message.content}`}],
    }));
    history.reverse();
    return history;
}

/**
 * 
 * @param {String} prompt 
 * @param {Array} history
 * @returns { Promise<import("@google/generative-ai").GenerateContentResult>}
 */
async function promptGemini(context, prompt, history) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", safetySettings, generationConfig });
    const chatProps = {
        history: [
            { role: "user", parts: [{text: "follow your context"}]},
            { role: "model", parts: context }
        ]
    };
    while (history.length > 0) {
        chatProps.history.push(history.shift());
    }
    const chat = model.startChat(chatProps);
    return chat.sendMessage(prompt);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDMPermission(true)
        .setDescription("Ask a question")
        .addStringOption(option =>
            option.setName("question")
                .setDescription("The question you want to ask")
                .setRequired(true)),
    usage: [
        "/ask \"question to ask\"",
        "or mention the bot",
        "or reply to bot",
    ],
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply({ephemeral: false});
        let lang = langCode.default;
        const user = await db.getData("users", interaction.user.id);
        if (user && user.lang)
            lang = user.lang;
        logger.info(languageData[lang]);
        if (!process.env.GEMINI_API_KEY) {
            logger.warn("Gemini was called but API key is missing!");
            await interaction.editReply({ content: languageData[lang].commands.ask.errors.no_api_key, ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 10000));
            await interaction.deleteReply();
            return;
        }
        try {
            const gemini = await promptGemini(
                getGeminiContext({interaction: interaction,}),
                interaction.options.getString("question"),
                await getHistory(interaction)
            );
            const text = gemini.response.text();
            logger.info(`Gemini API request by ${interaction.user.id}`);
            await interaction.editReply({ content: text, ephemeral: false});
        } catch (error) {
            logger.error(error);
            await interaction.editReply(languageData[lang].commands.ask.errors.request_failed);
        }
    },
    /**
     * 
     * @param {Message} message 
     */
    async messageExecute(message) {
        await message.channel.sendTyping();
        if (!process.env.GEMINI_API_KEY) {
            logger.warn("Gemini was called but API key is missing!");
            const errormsg = await message.channel.send({ content: languageData[lang].commands.ask.errors.no_api_key, ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 10000));
            errormsg.delete();
            return;
        }
        try {
            const gemini = await promptGemini(
                getGeminiContext({message: message}),
                message.content,
                await getHistory(message)
            );
            const text = gemini.response.text();
            logger.info(`Gemini API request by ${message.author.id}`);
            await message.channel.send(text);
        } catch (error) {
            logger.error(error);
            await message.channel.send(languageData[lang].commands.ask.errors.request_failed);
        }
    }

};