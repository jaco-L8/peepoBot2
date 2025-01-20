import { Client, GatewayIntentBits, Collection, Events, PermissionsBitField } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// initialise dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// define command interface
interface Command {
    data: {
        name: string;
    }
    execute: (interaction: any) => any;
}

// Extend the Client class to include a commands Collection
class CustomClient extends Client {
    commands: Collection<string, Command>;

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMembers, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.AutoModerationConfiguration] });
        this.commands = new Collection();
    }
}

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Depending on your needs, you might want to exit the process
    // process.exit(1);
});

// Initialize a new client instance
function initializeClient() {
    const newClient = new CustomClient();
    
    // Recreate commands collection
    newClient.commands = new Collection();

    // Reload commands
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                newClient.commands.set(command.data.name, command);
            }
        }
    }

    // Reload events
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            newClient.once(event.name, (...args) => event.execute(...args));
        } else {
            newClient.on(event.name, (...args) => event.execute(...args));
        }
    }

    return newClient;
}

// Initialize the client instance
const client = initializeClient();
client.login(process.env.TOKEN);

export { CustomClient, client, initializeClient };