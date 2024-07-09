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
            const guildsFetch = client.guilds.cache;
            const guildCount = guildsFetch.size;
            client.user.setActivity(`${guildCount} Servers 🌍`, { type: ActivityType.Custom });
        } else if (index === 2) {
            const nbCommands = client.commands.size;
            client.user.setActivity(`${nbCommands} Commands 🤖`, { type: ActivityType.Custom });
        } else if (index === 3) {
            client.user.setActivity(`You can talk to me! 🗣️`, { type: ActivityType.Custom });
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else if (index === 4) {
            client.user.setActivity(`Open source! 🚀`, { type: ActivityType.Custom, url: "https://github.com/rpdf/goofyn.git" });
        }
        index++;
        if (index >= 5) {
            await client.guilds.fetch();
            index = 0;
        }
    }, 5000);
}

module.exports = dynactivity;