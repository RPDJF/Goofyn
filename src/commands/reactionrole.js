const { Interaction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageReaction, User } = require('discord.js');
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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles & PermissionFlagsBits.ManageMessages)
        .setDescription("Manage reaction roles")
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Create a new reaction role message")
                .addStringOption(option =>
					option
						.setName("message")
						.setDescription("The message to send")
						.setRequired(true)))
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
						.setRequired(true))
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("Role id by default")
						.setRequired(false)))
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
					.setDescription("List all reaction role messages")),
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
			const messageData = { embeds: [msg(message, dictionary.commands.reactionrole.messages.choose_role)], ephemeral: false };
			await interaction.channel.send(messageData).then(async (message) => {
				if (reactionroles)
					reactionroles.push({ channel_id: interaction.channelId, message_id: message.id, roles: [] });
				else
					reactionroles = [{ channel_id: interaction.channelId, message_id: message.id, roles: [] }];
				db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
			});
			interaction.deleteReply();
		}

		else if (subcommand === "add") {
			const message_id = interaction.options.getString("message_id");
			const role = interaction.options.getRole("role");
			const emoji = interaction.options.getString("emoji");
			const description = interaction.options.getString("description") || `<@&${role.id}>`;

			if (!emoji.match(/<a?:.+>/) && !emoji.match(/\p{Extended_Pictographic}/u)) {
				await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.invalid_emoji)], ephemeral: true });
				await new Promise(resolve => setTimeout(resolve, 10000));
				interaction.deleteReply();
				return;
			}

			if (reactionroles && reactionroles[0]) {
				const reactionrole = reactionroles.find(r => r.message_id === message_id);
				if (reactionrole) {
					const channel = await interaction.guild.channels.fetch(reactionrole.channel_id);
					const message = await channel.messages.fetch(reactionrole.message_id);
					const embed = message.embeds[0];
					const updatedDescription = `${embed.description}\n\n${emoji} : ${description}`;
					const updatedEmbed = new EmbedBuilder(embed).setDescription(updatedDescription);
					const reaction = await message.react(emoji);
					const reaction_id = reaction._emoji.id || reaction._emoji.name;
					await message.edit({ embeds: [updatedEmbed] });
					reactionrole.roles.push({ role_id: role.id, reaction_id, emoji });
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
			const message_id = interaction.options.getString("message_id");
			const emoji = interaction.options.getString("emoji");
			if (reactionroles && reactionroles[0]) {
				let reactionrole_message = reactionroles.find(r => r.message_id === message_id);
				let reactionrole;
				if (reactionrole_message)
					reactionrole = reactionrole_message.roles.find(r => r.emoji === emoji);
				if (reactionrole) {
					const message = await (await interaction.guild.channels.fetch(reactionrole_message.channel_id)).messages.fetch(reactionrole_message.message_id);
					const reaction = message.reactions.cache.find(r => r.emoji.id === reactionrole.reaction_id || r.emoji.name === reactionrole.reaction_id);
					await reaction.remove();
					const embed = message.embeds[0];
					const findReactionRole = new RegExp(`^${emoji}.*$`, "m");
					const updatedDescription = embed.description.replace(findReactionRole, "");
					const updatedEmbed = new EmbedBuilder(embed).setDescription(updatedDescription);
					await message.edit({ embeds: [updatedEmbed] });
					reactionrole_message.roles = reactionrole_message.roles.filter(r => r.emoji !== emoji);
					await db.writeData("guilds", interaction.guildId, { reactionrole: reactionroles }, true);
					await interaction.editReply({ embeds: [msg(dictionary.commands.reactionrole.title.remove, dictionary.commands.reactionrole.messages.removed.replace("{role}", reactionrole.role_id))], ephemeral: true });
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

		else if (subcommand === "list") {
			if (reactionroles && reactionroles[0]) {
				let message = "";
				for (const reactionrole of reactionroles) {
					message += `https://discord.com/channels/${interaction.guildId}/${reactionrole.channel_id}/${reactionrole.message_id}\n`;
					for (const role of reactionrole.roles) {
						message += `- ${role.emoji} : <@&${role.role_id}>\n`;
					}
					message += "\n";
				}
				interaction.editReply({ embeds: [msg(dictionary.commands.reactionrole.title.list, message)], ephemeral: true });
			} else {
				await interaction.editReply({ embeds: [errorMsg(dictionary.errors.title, dictionary.commands.reactionrole.errors.no_reactionroles)], ephemeral: true });
				await new Promise(resolve => setTimeout(resolve, 10000));
				interaction.deleteReply();
			}
		}
    },

	/**
	 * Function to be called when a new reaction is added to a reaction role message
	 * @param {MessageReaction} reaction
	 * @param {User} user
	 * @returns {Promise<void>}
	 */
	async onReactionAdd_hook(reaction, user) {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				logger.error(error);
				return;
			}
		}
		let reactionroles = (await db.getData("guilds", reaction.message.guild.id)).reactionrole;
		if (reactionroles && reactionroles[0]) {
			const reactionrole = reactionroles.find(r => r.message_id === reaction.message.id && r.channel_id === reaction.message.channel.id);
			if (reactionrole) {
				let role = reactionrole.roles.find(r => r.reaction_id === reaction.emoji.id || r.reaction_id === reaction.emoji.name);
				if (role) {
					const member = await reaction.message.guild.members.fetch(user.id);
					await member.roles.add(role.role_id).catch(async (err) => {
						if (err.code === 50013) {
							const dictionary = await getDictionary({ userid: user.id });
							const reply = await user.send({ embeds: [errorMsg(dictionary.errors.title, dictionary.errors.execution_missing_perms)], ephemeral: true });
							user
							await new Promise(resolve => setTimeout(resolve, 20000));
							reply.delete();
						} else {
							logger.error(err);
						}
					});
				}
			}
		}
	},

	/**
	 * Function to be called when a reaction is removed from a reaction role message
	 * @param {MessageReaction} reaction
	 * @param {User} user
	 * @returns {Promise<void>}
	 */
	async onReactionRemove_hook(reaction, user) {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				logger.error(error);
				return;
			}
		}
		let reactionroles = (await db.getData("guilds", reaction.message.guild.id)).reactionrole;
		if (reactionroles && reactionroles[0]) {
			const reactionrole = reactionroles.find(r => r.message_id === reaction.message.id && r.channel_id === reaction.message.channel.id);
			if (reactionrole) {
				let role = reactionrole.roles.find(r => r.reaction_id === reaction.emoji.id || r.reaction_id === reaction.emoji.name);
				if (role) {
					const member = await reaction.message.guild.members.fetch(user.id);
					await member.roles.remove(role.role_id).catch(async (err) => {
						if (err.code === 50013) {
							const dictionary = await getDictionary({ userid: user.id });
							const reply = await user.send({ embeds: [errorMsg(dictionary.errors.title, dictionary.errors.execution_missing_perms)], ephemeral: true });
							await new Promise(resolve => setTimeout(resolve, 20000));
							reply.delete();
						} else {
							logger.error(err);
						}
					});
				}
			}
		}
	}
};