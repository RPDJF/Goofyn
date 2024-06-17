const { getGeminiContext, safetySettings, generationConfig, historySettings } = require('../../config/ask_gemini_conf');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, Message, Collection } = require('discord.js');
const { commands } = require('./commands');
const logger = require('../utils/logger');

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
        if (!process.env.GEMINI_API_KEY) {
            logger.warn("Gemini was called but the API key is missing!");
            await interaction.reply({ content: "The Gemini API key is missing!", ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 5000));
            await interaction.deleteReply();
            return;
        }
        try {
            await interaction.deferReply({ephemeral: false});
            const gemini = await promptGemini(
                getGeminiContext({interaction: interaction,}),
                interaction.options.getString("question"),
                await getHistory(interaction)
            );
            const text = gemini.response.text();
            logger.info(`Gemini API request by ${interaction.user.id}`);
            if (text.startsWith("execute:")) {
                logger.warn(`User ${interaction.user.id} tried to execute a command: ${text}`);
                await interaction.editReply("I can't execute commands from slash commands (yet)!\nPlease ping me in a message to execute a command, or use the command directly.");
                return;
            }
            await interaction.editReply({ content: gemini.response.text(), ephemeral: false});
        } catch (error) {
            logger.error(error);
            await interaction.editReply(error.message);
        }
    },
    /**
     * 
     * @param {Message} message 
     */
    async messageExecute(message) {
        await message.channel.sendTyping();
        if (!process.env.GEMINI_API_KEY) {
            logger.warn("Gemini was called but the API key is missing!");
            const error = await message.channel.send({ content: "The Gemini API key is missing!", ephemeral: true });
            await new Promise(resolve => setTimeout(resolve, 5000));
            error.delete();
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
            if (text.startsWith("execute:")) {
                logger.info(`Searching for command: ${text}`);
                const command = commands.get(text.substring("execute:".length).trim().split(" ")[0]);
                if (command === "ask") {
                    logger.info(`Command "ask" is not available for IA to execute!`);
                    await message.channel.send("This command isn't available for IA to execute!");
                    return;
                }
                if (command && command != commands.get() && command.messageExecute) {
                    try{
                        await message.channel.send(`Executing command ${text.substring("execute:".length).trim()}`);
                        await command.messageExecute(message);
                    } catch (error) {
                        logger.error(error);
                        await message.channel.send("Failed to execute command!");
                    }
                } else if (command) {
                    logger.warn(`Command does not have messageExecute function: ${command}`);
                    await message.channel.send("This command isn't available for IA to execute!");
                } else {
                    logger.warn(`Command not found: ${command}`);
                    await message.channel.send("Command not found!");
                }
            } else {
                await message.channel.send(text);
            }
        } catch (error) {
            logger.error(error);
            await message.channel.send(error.message);
        }
    }

};