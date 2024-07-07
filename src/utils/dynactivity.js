const { Client, ActivityType } = require('discord.js');

/**
 * 
 * @param {Client} client
 * @returns {Promise<void>}
 */
async function dynactivity(client) {
	let index = 0;
	setInterval(async () => {
		if (index === 0) {
			const guildsFetch = client.guilds.cache;
			const userCount = guildsFetch.reduce((acc, guild) => acc + guild.memberCount, 0);
			client.user.setActivity(`${userCount} Users 😎`, { type: ActivityType.Custom });
		} else if (index === 1) {
			const channelCount = client.channels.cache.size;
			client.user.setActivity(`${channelCount} Channels 📚`, { type: ActivityType.Custom });
		} else if (index === 2) {
			const guildsFetch = client.guilds.cache;
			const guildCount = guildsFetch.size;
			client.user.setActivity(`${guildCount} Servers 🌍`, { type: ActivityType.Custom });
		} else if (index === 3) {
			client.user.setActivity(`Open source! 🚀`, { type: ActivityType.Custom, url: "https://github.com/rpdf/goofyn.git" });
		}
		index++;
		if (index >= 4) {
			await client.guilds.fetch();
			index = 0;
		}
	}, 5000);
}

module.exports = dynactivity;