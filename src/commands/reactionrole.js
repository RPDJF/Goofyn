const { Interaction, SlashCommandBuilder, PermissionFlagsBits, GuildMember, Message, BaseInteraction } = require('discord.js');
const { getDictionary } = require("../utils/dictionary");
const db = require("../utils/db");
const { msg, errorMsg } = require('../utils/embeds');
const logger = require('../utils/logger');

// This command requires the function onGuildMemberAdd_hook to be called when a new member joins the server

/**
 * Clean up the data by removing reaction roles messages that no longer exist
 * @param {Interaction} interaction
 * @param {Object} reactionroles
 * @returns {Promise<Object>}
 */
async function cleanUpData(interaction, reactionroles) {
	if (reactionroles && reactionroles[0]) {
		let triggered = false;
		for (const reactionrole of reactionroles) {
			try {
				const channel = await interaction.guild.channels.fetch(reactionrole.channel_id);
				await channel.messages.fetch(reactionrole.message_id);
			} catch (e) {
				reactionroles = reactionroles.filter(r => r.message_id !== reactionrole.message_id);
				triggered = true;
			}
		}
		if (triggered)
			await db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
	}
	return reactionroles;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reactionrole")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDescription("Manage reaction roles")
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Create a new reaction role message")
                .addStringOption(option =>
					option
						.setName("message")
						.setDescription("The message to send")
						.setRequired(true))
				.addBooleanOption(option =>
					option
						.setName("use_embed")
						.setDescription("Whether to use an embed")
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand
				.setName("add")
				.setDescription("Add a reaction role to an existing message")
				.addStringOption(option =>
					option
						.setName("message_id")
						.setDescription("The message ID")
						.setRequired(true))
				.addRoleOption(option =>
					option
						.setName("role")
						.setDescription("The role to add")
						.setRequired(true))
				.addStringOption(option =>
					option
						.setName("emoji")
						.setDescription("The emoji to react with")
						.setRequired(true)))
			.addSubcommand(subcommand =>
				subcommand
					.setName("remove")
					.setDescription("Remove a reaction role from an existing message")
					.addStringOption(option =>
						option
							.setName("message_id")
							.setDescription("The message ID")
							.setRequired(true))
					.addStringOption(option =>
						option
							.setName("emoji")
							.setDescription("The emoji to remove")
							.setRequired(true)))
			.addSubcommand(subcommand =>
				subcommand
					.setName("delete")
					.setDescription("Delete a reaction role message")
					.addStringOption(option =>
						option
							.setName("message_id")
							.setDescription("The message ID")
							.setRequired(true)))
			.addSubcommand(subcommand =>
				subcommand
					.setName("list")
					.setDescription("List all reaction role messages")
					.addStringOption(option =>
						option
							.setName("message_id")
							.setDescription("The message ID")
							.setRequired(false))),
    /**
     * Instructions to execute
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const dictionary = await getDictionary({ guildid: interaction.guildId });
        const subcommand = interaction.options.getSubcommand();
		let reactionroles = (await db.getData("guilds", interaction.guildId)).reactionrole;

		// Check if reaction roles messages exist, if not remove them from the reactionroles list
		reactionroles = await cleanUpData(interaction, reactionroles);

		// Execute the subcommands
		if (subcommand === "new") {
			const message = interaction.options.getString("message");
			let use_embed = interaction.options.getBoolean("use_embed");
			if (use_embed === null)
				use_embed = true;
			const messageData = use_embed ? { embeds: [msg(message, dictionary.commands.reactionrole.messages.choose_role)], ephemeral: false } : { content: message, ephemeral: false };
			interaction.editReply(messageData).then(async (message) => {
				if (reactionroles)
					reactionroles.push({ channel_id: interaction.channelId, message_id: message.id, roles: [] });
				else
					reactionroles = [{ channel_id: interaction.channelId, message_id: message.id, roles: [] }];
				db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
			});
		}

		else if (subcommand === "add") {
			const message_id = interaction.options.getString("message_id");
			const role = interaction.options.getRole("role");
			/** @type {String} */
			const emoji = interaction.options.getString("emoji");

			if (!emoji.match(/<a?:.+:\d+>/)) {
				await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.invalid_emoji)], ephemeral: true });
				await new Promise(resolve => setTimeout(resolve, 10000));
				interaction.deleteReply();
				return;
			} else {
				const emoji_id = emoji.match(/\d+/)[0];
				const guildEmojis = await interaction.guild.emojis.fetch();
				if (!guildEmojis.has(emoji_id)) {
					await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.invalid_emoji)], ephemeral: true });
					await new Promise(resolve => setTimeout(resolve, 10000));
					interaction.deleteReply();
					return;
				}
			}

			if (reactionroles && reactionroles[0]) {
				const reactionrole = reactionroles.find(r => r.message_id === message_id);
				if (reactionrole) {
					const channel = await interaction.guild.channels.fetch(reactionrole.channel_id);
					const message = await channel.messages.fetch(reactionrole.message_id);
					const emoji_id = (await message.react(emoji))._emoji.id;
					reactionrole.roles.push({ role_id: role.id, emoji_id });
					db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
					await interaction.editReply({ embeds: [msg(dictionary.commands.reactionrole.title.add, dictionary.commands.reactionrole.messages.added.replace("{role}", role.id))], ephemeral: true });
					await new Promise(resolve => setTimeout(resolve, 10000));
					interaction.deleteReply();
				} else {
					await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.message_not_found)], ephemeral: true });
					await new Promise(resolve => setTimeout(resolve, 10000));
					interaction.deleteReply();
				}
			} else {
				await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.no_reactionroles)], ephemeral: true });
				await new Promise(resolve => setTimeout(resolve, 10000));
				interaction.deleteReply();
			}
		}

		else if (subcommand === "remove") {
			// TODO: Implement the remove subcommand
			// Emoji ID is now stored, may need to redo this function
			const message_id = interaction.options.getString("message_id");
			const emoji = interaction.options.getString("emoji");
			if (reactionroles && reactionroles[0]) {
				const reactionrole = reactionroles.find(r => r.message_id === message_id);
				if (reactionrole) {
					const channel = await interaction.guild.channels.fetch(reactionrole.channel_id);
					const message = await channel.messages.fetch(reactionrole.message_id);
					console.log(message.reactions.cache);
					for (const reaction of message.reactions.cache) {
						console.log(reaction);
					}
					const reaction = message.reactions.cache.find(r => r.emoji.name === emoji);
					if (reaction) {
						const role = reactionrole.roles.find(r => r.emoji === emoji);
						reactionrole.roles = reactionrole.roles.filter(r => r.emoji !== emoji);
						db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
						await interaction.editReply({ embeds: [msg(dictionary.commands.reactionrole.title.remove, dictionary.commands.reactionrole.messages.removed.replace("{role}", role.role_id))], ephemeral: true });
						await new Promise(resolve => setTimeout(resolve, 10000));
						interaction.deleteReply();
					} else {
						await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.reaction_not_found)], ephemeral: true });
						await new Promise(resolve => setTimeout(resolve, 10000));
						interaction.deleteReply();
					}
				} else {
					await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.message_not_found)], ephemeral: true });
					await new Promise(resolve => setTimeout(resolve, 10000));
					interaction.deleteReply();
				}
			} else {
				await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.no_reactionroles)], ephemeral: true });
				await new Promise(resolve => setTimeout(resolve, 10000));
				interaction.deleteReply();
			}
		}

		else if (subcommand === "delete") {
			const message_id = interaction.options.getString("message_id");
			let reactionroles = (await db.getData("guilds", interaction.guildId)).reactionrole;
			if (reactionroles && reactionroles[0]) {
				if (reactionroles.find(r => r.message_id === message_id)) {
					reactionroles = reactionroles.filter(r => r.message_id !== message_id);
					db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
					await interaction.editReply({ embeds: [msg(dictionary.commands.reactionrole.title.delete, dictionary.commands.reactionrole.messages.deleted)], ephemeral: true });
					await new Promise(resolve => setTimeout(resolve, 10000));
					interaction.deleteReply();
				} else {
					await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.message_not_found)], ephemeral: true });
					await new Promise(resolve => setTimeout(resolve, 10000));
					interaction.deleteReply();
				}
			} else {
				interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.no_reactionroles)], ephemeral: true });
			}
		}
    },
};