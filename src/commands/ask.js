const { getGeminiContext, safetySettings, generationConfig, historySettings } = require('../../config/ask_gemini_conf');
const { Interaction, Message, Collection, ChannelType, MessageType, SlashCommandBuilder } = require('discord.js');
const { getDictionary } = require('../utils/dictionary');
const { errorMsg, Author } = require('../utils/embeds');
const logger = require('../utils/logger');

// Requires API key to be set in environment variable GEMINI_API_KEY

const author = new Author("Gemini", "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png", "https://gemini.google.com/");

/**
 *
 * @param {Message} message 
 */
async function messageExecute(message) {
    await message.channel.sendTyping();
    const dictionary = message.guild ? await getDictionary({ guildid: message.guild.id }) : await getDictionary({ userid: message.author.id });
    if (!process.env.GEMINI_API_KEY) {
        logger.warn("Gemini was called but API key is missing!");
        const errormsg = await message.channel.send({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.ask.errors.no_api_key, author)], ephemeral: true });
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
        await message.channel.send(dictionary.commands.ask.errors.request_failed);
    }
}

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
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply({ephemeral: false});
        const dictionary = interaction.guild ? await getDictionary({ guildid: interaction.guildId }) : await getDictionary({ userid: interaction.user.id });
        if (!process.env.GEMINI_API_KEY) {
            logger.warn("Gemini was called but API key is missing!");
            await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.ask.errors.no_api_key, author)]})
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
            await interaction.editReply(dictionary.commands.ask.errors.request_failed);
        }
    },

    /**
     * 
     * @param {Message} message
     * @returns {Promise<void>}
     */
    async onMessageCreate_hook(message) {
        if (message.channel.type === ChannelType.DM || message.channel.type == ChannelType.GroupDM
            || message.mentions.has(message.client.user.id) && (message.type === MessageType.Reply || message.content.includes(`<@${message.client.user.id}>`))) {
                messageExecute(message);
        }
    }

};