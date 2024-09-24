"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
// initialise dotenv
const dotenv = require("dotenv");
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD;
const guildTestId = process.env.DISCORD_TEST_GUILD;
if (!token || !clientId || !guildId || !guildTestId) {
    throw new Error('Missing environment variable');
}
// Initialize two arrays for commands
const guildCommands = [];
const globalCommands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    console.log(`Processing folder: ${folder}`); // Debug: Log the folder being processed
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            if (folder === "global") {
                console.log(`Adding to globalCommands: ${command.data.name}`); // Debug: Log command being added to global
                globalCommands.push(command.data.toJSON());
            }
            else {
                console.log(`Adding to guildCommands: ${command.data.name}`); // Debug: Log command being added to guild
                guildCommands.push(command.data.toJSON());
            }
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
// construct a new REST instance
const rest = new discord_js_1.REST().setToken(token);
// command deployment
(async () => {
    try {
        // Deploy guild-specific commands
        console.log(`Started refreshing ${guildCommands.length} guild-specific application (/) commands.`);
        await rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, guildTestId), { body: guildCommands });
        console.log(`Successfully reloaded guild-specific application (/) commands.`);
        // Deploy global commands if there are any
        if (globalCommands.length > 0) {
            console.log(`Started refreshing ${globalCommands.length} global application (/) commands.`);
            await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: globalCommands });
            console.log(`Successfully reloaded global application (/) commands.`);
        }
    }
    catch (error) {
        // error handling
        console.error(error);
    }
})();
