const { Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { msg, errorMsg, Author } = require('../utils/embedUtility.js');
const { getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const logger = require('../utils/logger');
const axios = require("axios");

const author = new Author("waifu.pics", "https://waifu.pics/favicon.ico", "https://waifu.pics/");

const availInteractions = [
    ["bite", "😯 bite someone", true],
    ["blush", "😳 blush", false],
    ["bonk", "🔨 bonk someone", true],
    ["bully", "😢 bully someone", true],
    ["cuddle", "🤗 cuddle someone", true],
    ["cringe", "😬 cringe", false],
    ["cry", "😢 cry", false],
    ["dance", "💃 dance", false],
    ["handhold", "🤝 hold someone's hand", true],
    ["highfive", "🖐️ highfive someone", true],
    ["hug", "🤗 hug someone", true],
    ["kick", "🦵 kick someone", true],
    ["kill", "💀 kill someone", true],
    ["kiss", "😘 kiss someone", true],
    ["lick", "😝 lick someone", true],
    ["nom", "🤐 nom someone", false],
    ["pat", "🖐️ pat someone", true],
    ["poke", "👉 poke someone", true],
    ["slap", "✋ slap someone", true],
    ["smile", "😊 just smile", false],
    ["smug", "( ͡° ͜ʖ ͡°)", false],
    ["wave", "👋 wave at someone", true],
    ["wink", "😉 wint at someone", true],
    ["yeet", "⚾ yeet at someone", true],
];

const slashCommand = () => {
    const builder = new SlashCommandBuilder()
        .setName("interaction")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDescription("Interact !");
    for (const interaction of availInteractions) {
        builder.addSubcommand(subcommand => {
            subcommand
                .setName(interaction[0])
                .setDescription(interaction[1]);
            if (interaction[2]) {
                subcommand.addMentionableOption(input =>
                    input
                        .setName("target")
                        .setDescription("The user to interact with")
                        .setRequired(true)
                );
            }
            return subcommand;
        });
    }
    return builder;
}

module.exports = {
    data: slashCommand(),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getMentionable("target");

        const imageUrl = await axios.get(`https://api.waifu.pics/sfw/${subcommand}`).then(res => res.data.url);

        const description = () => {
            let desc;
            const actions = dictionary.commands.interaction.interactions[subcommand];
            desc = actions[Math.floor(Math.random() * actions.length)].replace("{author}", `<@${interaction.user.id}>`);
            if (target) desc = desc.replace("{target}", `<@${target.id}>`);
            return desc;
        }

        const embed = msg(null, description(), null, author);
        embed.setImage(imageUrl);
        await interaction.editReply({ embeds: [embed], ephemeral: false });
    },
};