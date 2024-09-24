"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
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
// construct a new REST instance
const rest = new discord_js_1.REST().setToken(token);
const deletedCommandID = [
    '1258982017006047264'
];
// for guild-based commands
rest.delete(discord_js_1.Routes.applicationGuildCommand(clientId, guildId, deletedCommandID[0]))
    .then(() => console.log('Successfully deleted guild command'))
    .catch(console.error);
// for global commands
rest.delete(discord_js_1.Routes.applicationCommand(clientId, deletedCommandID[0]))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);
