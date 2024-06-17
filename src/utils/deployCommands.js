const { REST, Routes, Collection } = require('discord.js');
const { DISCORD_CLIENT_SECRET, DISCORD_CLIENT_ID, GUILD_ID } = require('dotenv').config().parsed;
const logger = require('./logger');

/**
 * 
 * @param {Array} commands 
 */
function deployCommands(commands) {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(DISCORD_CLIENT_SECRET);

    // and deploy your commands!
    (async () => {
        try {
            logger.info(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(DISCORD_CLIENT_ID),
                { body: commands },
            );

            logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            logger.error(error);
        }
    })();
}

module.exports = { deployCommands };