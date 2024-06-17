const { Client } = require('discord.js');

const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {Client} client 
 * @param {string} dir
 * @returns {null}
 */
function loadCommands(client, dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file == "commands.js")
            continue;
        const filefullName = path.join(dir, file);
        const stat = fs.lstatSync(filefullName);
        if (stat.isDirectory()) {
            loadCommands(client, filefullName);
        } else {
            if (file.endsWith('.js')) {
                const command = require(filefullName);
                if (!command.data || !command.execute) {
                    logger.warn(`Command ${filefullName} is missing data or execute function`);
                    continue;
                }
                client.commands.set(command.data.name, command);
            }
        }
    }
}

module.exports = { loadCommands };