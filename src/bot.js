const { loadCommands } = require("./utils/loadCommands");
const { deployCommands } = require("./utils/deployCommands");
const { commands } = require("./commands/commands");
const logger = require("./utils/logger");
const { Client, GatewayIntentBits, Events, MessageType, Partials, ChannelType } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
    allowedMentions: { parse: ['users'], repliedUser: true },
    partials: [Partials.Channel],
});
const fs = require("fs");
const { errorMsg } = require("./utils/embeds");
const { getDictionary } = require("./utils/dictionary");

if (!fs.existsSync(".env")) {
    logger.error("No .env file found. Please check the README.md for instructions on setting up the environment variables.");
    process.exit(1);
}

client.commands = commands;
loadCommands(client, `${__dirname}/commands`);
deployCommands(client.commands.map((command) => command.data.toJSON()));

client.login(process.env.DISCORD_CLIENT_SECRET).catch((err) => {
    logger.error(err);
    process.exit(1);
});

client.on(Events.ClientReady, () => {
    logger.info(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        logger.warn(`Command ${interaction.commandName} not found`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(error);
        const dictionary = interaction.guild ? await getDictionary({ guildid: interaction.guildId }) : await getDictionary({ userid: interaction.user.id });
        await interaction.editReply({ embeds: [ errorMsg(dictionary.errors.execution_error) ], ephemeral: true });
        await new Promise(resolve => setTimeout(resolve, 10000));
        await interaction.deleteReply();
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Use messageExecute from the ask command to handle the message
    if (message.channel.type === ChannelType.DM || message.channel.type == ChannelType.GroupDM
        || message.mentions.has(client.user.id) && (message.type === MessageType.Reply || message.content.includes(`<@${client.user.id}>`))) {
            const command = client.commands.get("ask");
            if (command && command.messageExecute)
                command.messageExecute(message);
    }
});