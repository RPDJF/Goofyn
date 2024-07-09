const { Interaction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { msg, errorMsg } = require('../utils/embedUtility.js');
const { getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const logger = require('../utils/logger');

function update_media(embed, image, thumbnail) {
    if (image) {
        if (image.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)) {
            embed.setImage(image);
        } else
            return 1;
    }
    if (thumbnail) {
        if (thumbnail.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)) {
            embed.setThumbnail(thumbnail);
        } else
            return 1;
    }
    return 0;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDescription("Manage bot embeds")
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Create a new embed")
                .addStringOption(option =>
                    option
                        .setName("title")
                        .setDescription("The embed title")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("The embed description")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("color")
                        .setDescription("The embed color in hex")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("image")
                        .setDescription("The embed image")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("thumbnail")
                        .setDescription("The embed thumbnail")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("edit")
                .setDescription("Edit an embed")
                .addStringOption(option =>
                    option
                        .setName("message_id")
                        .setDescription("The message ID")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("title")
                        .setDescription("The embed title")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("description")
                        .setDescription("The embed description")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("color")
                        .setDescription("The embed color in hex")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("image")
                        .setDescription("The embed image")
                        .setRequired(false)
                )
                .addStringOption(option =>
                    option
                        .setName("thumbnail")
                        .setDescription("The embed thumbnail")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("Delete an embed")
                .addStringOption(option =>
                    option
                        .setName("message_id")
                        .setDescription("The message ID")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove an embed from a message")
                .addStringOption(option =>
                    option
                        .setName("message_id")
                        .setDescription("The message ID")
                        .setRequired(true)
                )
        ),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();
        const dictionary = await getDictionary(interaction.guildId ? { guildid: interaction.guildId } : { userid: interaction.user.id });

        if (subcommand === "new") {
            const embed_title = interaction.options.getString("title");
            const embed_description = interaction.options.getString("description");
            const embed_color = interaction.options.getString("color") ? interaction.options.getString("color").replace("#", "").replace("0x", "") : undefined;
            const embed_image = interaction.options.getString("image") || undefined;
            const embed_thumbnail = interaction.options.getString("thumbnail") || undefined;

            const embed = msg(
                embed_title,
                embed_description,
                embed_color || undefined,
            );

            if (update_media(embed, embed_image, embed_thumbnail)) {
                const title = dictionary.errors.title;
                const description = dictionary.errors.invalid_thumbnail;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }

            await interaction.channel.send({ embeds: [embed] });
            
            const title = dictionary.commands.embed.title.new;
            const description = dictionary.commands.embed.success.embed_created;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
            return;
        }

        else if (subcommand === "edit") {
            const messageID = interaction.options.getString("message_id");
            const embed_title = interaction.options.getString("title");
            const embed_description = interaction.options.getString("description");
            const embed_color = interaction.options.getString("color") ? interaction.options.getString("color").replace("#", "").replace("0x", "") : undefined;
            const embed_image = interaction.options.getString("image") || undefined;
            const embed_thumbnail = interaction.options.getString("thumbnail") || undefined;

            if (!embed_title && !embed_description && !embed_color && !embed_image && !embed_thumbnail) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_no_changes;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }

            let embed;
            const messageToEdit = await interaction.channel.messages.fetch(messageID);
            if (!messageToEdit) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_not_found;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            } else if (messageToEdit.author.id !== interaction.client.user.id) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_not_bot;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            } else if (!messageToEdit.embeds || messageToEdit.embeds.length <= 0) {
                if (!embed_title || !embed_description) {
                    const title = dictionary.errors.title;
                    const description = dictionary.commands.embed.errors.embed_no_title_description;
                    await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                    new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                    return;
                }
                embed = msg(
                    embed_title,
                    embed_description,
                    embed_color || undefined,
                );
            } else {
                embed = new EmbedBuilder(messageToEdit.embeds[0]);
                if (embed_title)
                    embed.setTitle(embed_title);
                if (embed_description)
                    embed.setDescription(embed_description);
                if (embed_color)
                    embed.setColor(embed_color);
            }
            if (update_media(embed, embed_image, embed_thumbnail)) {
                const title = dictionary.errors.title;
                const description = dictionary.errors.invalid_thumbnail;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }

            await messageToEdit.edit({ embeds: [embed] });

            const title = dictionary.commands.embed.title.edit;
            const description = dictionary.commands.embed.success.embed_edited;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
            return;
        }

        else if (subcommand === "delete") {
            const messageID = interaction.options.getString("message_id");
            
            const messageToDelete = await interaction.channel.messages.fetch(messageID);
            if (!messageToDelete) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_not_found;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            } else if (messageToDelete.author.id !== interaction.client.user.id) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_not_bot;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }
            
            await messageToDelete.delete();

            const title = dictionary.commands.embed.title.delete;
            const description = dictionary.commands.embed.success.embed_deleted;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
            return;
        }

        else if (subcommand === "remove") {
            const messageID = interaction.options.getString("message_id");
            
            const messageToRemove = await interaction.channel.messages.fetch(messageID);
            if (!messageToRemove) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_not_found;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            } else if (messageToRemove.author.id !== interaction.client.user.id) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_not_bot;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            } else if (!messageToRemove.embeds || messageToRemove.embeds.length <= 0) {
                const title = dictionary.errors.title;
                const description = dictionary.commands.embed.errors.embed_no_embed;
                await interaction.editReply({ embeds: [errorMsg(title, description)], ephemeral: true });
                new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
                return;
            }
            
            await (messageToRemove.edit({ embeds: [] }).catch(error => {
                // Edge case if the message only has an embed
                if (error.code === 50006 && error.rawError.message.includes("empty")) {
                    messageToRemove.delete();
                    return ;
                }
                throw error;
            }));

            const title = dictionary.commands.embed.title.remove;
            const description = dictionary.commands.embed.success.embed_removed;
            await interaction.editReply({ embeds: [msg(title, description)], ephemeral: true });
            new Promise(resolve => setTimeout(resolve, 10000)).then(() => interaction.deleteReply());
            return;
        }
    },
};