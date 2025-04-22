const { getGeminiContext, safetySettings, generationConfig, historySettings } =
  require("../../config/ask_gemini_conf");
const {
  Interaction,
  Message,
  Collection,
  ChannelType,
  MessageType,
  SlashCommandBuilder,
} = require("discord.js");
const { getDictionary } = require("../utils/dictionary");
const { errorMsg, Author } = require("../utils/embedUtility");
const { textParser } = require("../utils/textParser");
const logger = require("../utils/logger");

// Requires API key to be set in environment variable GEMINI_API_KEY

const author = new Author(
  "Gemini",
  "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png",
  "https://gemini.google.com/",
);

/**
 * @param {Message} message
 */
async function messageExecute(message) {
  await message.channel.sendTyping();
  const dictionary = await getDictionary(
    message.guildId
      ? { guildid: message.guildId }
      : { userid: message.author.id },
  );
  if (!process.env.GEMINI_API_KEY) {
    logger.warn("Gemini was called but API key is missing!");
    const errormsg = await message.channel.send({
      embeds: [
        errorMsg(
          dictionary.errors.title,
          dictionary.commands.ask.errors.no_api_key,
          author,
        ),
      ],
      ephemeral: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 10000)).then(async () =>
      await errormsg.delete()
    );
    return;
  }
  try {
    const gemini = await promptGemini(
      getGeminiContext({ message: message }),
      await textParser(message, message.content),
      await getHistory(message),
    );
    console.table(gemini);
    const text = gemini.text;
    logger.info(`Gemini API request by ${message.author.id}`);
    await message.channel.send(text);
  } catch (error) {
    logger.error(error);
    await message.channel.send(dictionary.commands.ask.errors.request_failed);
  }
}

/**
 * @param {Interaction} interaction
 * @returns {Promise<Array>}
 */
async function getHistory(interaction) {
  /** @type {Collection<String, Message>} */
  const messages = await interaction.channel.messages.fetch({
    limit: historySettings.maxMessages,
  }).catch((error) => {
    logger.error(error);
    return [];
  });

  const history = [];
  messages.map((message) =>
    history.push({
      role: (message.author.id === interaction.client.user.id)
        ? "model"
        : "user",
      parts: (message.author.id === interaction.client.user.id)
        ? [{ text: message.content }]
        : [{ text: `<@${message.author.id}>:${message.content}` }],
    })
  );
  history.reverse();
  return history;
}

/**
 * @param {Array<string>} context
 * @param {String} prompt
 * @param {Array} history
 * @returns {Promise<object>}
 */
async function promptGemini(context, prompt, history) {
  const { GoogleGenAI, createUserContent, createModelContent } = require("@google/genai");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const contents = [
    createModelContent([
        "Follow your context",
        context.join("\n"),
    ])
  ];

  while (history.length > 0) {
    const content = createUserContent([
        history.shift().parts[0].text,
    ]);
    contents.push(content);
  }

  console.table(contents);
  console.table(contents.at(contents.length - 1));
  console.table(contents.at(contents.length - 1).parts[0]);
  console.table(contents.at(contents.length - 1).parts[0].text);

  return ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    safetySettings,
    generationConfig,
    contents,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDMPermission(true)
    .setDescription("Ask a question")
    .addStringOption((option) =>
      option.setName("question")
        .setDescription("The question you want to ask")
        .setRequired(true)
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
    if (!process.env.GEMINI_API_KEY) {
      logger.warn("Gemini was called but API key is missing!");
      await interaction.editReply({
        embeds: [
          errorMsg(
            dictionary.errors.title,
            dictionary.commands.ask.errors.no_api_key,
            author,
          ),
        ],
      });
      await new Promise((resolve) => setTimeout(resolve, 10000)).then(
        async () => await interaction.deleteReply(),
      );
      return;
    }
    await interaction.editReply({ content: dictionary.commands.ask.errors.depracted_usage, ephemeral: false });
  },

  /**
   * @param {Message} message
   * @returns {Promise<void>}
   */
  async onMessageCreate_hook(message) {
    if (
      message.channel.type === ChannelType.DM ||
      message.channel.type == ChannelType.GroupDM ||
      message.mentions.has(message.client.user.id) &&
        (message.type === MessageType.Reply ||
          message.content.includes(`<@${message.client.user.id}>`))
    ) {
      messageExecute(message);
    }
  },
};
