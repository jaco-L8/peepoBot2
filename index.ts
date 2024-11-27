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

// create a new client instance
const client = new CustomClient();



//create a collection
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
};


// events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`Event ${event.name} loaded.`);
};


client.login(process.env.TOKEN);

export { CustomClient , client };