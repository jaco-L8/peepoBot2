"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
// initialise dotenv
const dotenv = require("dotenv");
dotenv.config();
// Extend the Client class to include a commands Collection
class CustomClient extends discord_js_1.Client {
    commands;
    constructor() {
        super({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildModeration] });
        this.commands = new discord_js_1.Collection();
    }
}
exports.CustomClient = CustomClient;
// create a new client instance
const client = new CustomClient();
exports.client = client;
//create a collection
client.commands = new discord_js_1.Collection();
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
        }
        else {
            console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
;
// events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`Event ${event.name} loaded.`);
}
;
client.login(process.env.TOKEN);
