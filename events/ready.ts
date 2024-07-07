import { Events } from 'discord.js';
import { CustomClient } from '../index';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: CustomClient ) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    },
}
