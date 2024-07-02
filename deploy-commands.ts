import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// initialise dotenv
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD;


if (!token || !clientId || !guildId) {
    throw new Error('Missing environment variable');
}



// define command interface
interface Command {
    data: {
        name: string;
    };
}

// Initialize two arrays for commands
const guildCommands: Command['data'][] = [];
const globalCommands: Command['data'][] = [];

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
            } else {
                console.log(`Adding to guildCommands: ${command.data.name}`); // Debug: Log command being added to guild
                guildCommands.push(command.data.toJSON());
            }
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// construct a new REST instance
const rest = new REST().setToken(token);

// command deployment
(async () => {
    try {
        // Deploy guild-specific commands
        console.log(`Started refreshing ${guildCommands.length} guild-specific application (/) commands.`);
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: guildCommands },
        );
        console.log(`Successfully reloaded guild-specific application (/) commands.`);

        // Deploy global commands if there are any
        if (globalCommands.length > 0) {
            console.log(`Started refreshing ${globalCommands.length} global application (/) commands.`);
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: globalCommands },
            );
            console.log(`Successfully reloaded global application (/) commands.`);
        }
    } catch (error) {
        // error handling
        console.error(error);
    }
})();