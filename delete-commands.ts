import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

// initialise dotenv
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD;
const guildTestId = process.env.DISCORD_TEST_GUILD;


if (!token || !clientId || !guildId || !guildTestId) {
    throw new Error('Missing environment variable');
}

// construct a new REST instance
const rest = new REST().setToken(token);

// define command interface
interface Command {
    data: {
        name: string;
    };
}



const deletedCommandID = [
    '1258982017006047264'
]



// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, deletedCommandID[0]))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, deletedCommandID[0]))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);