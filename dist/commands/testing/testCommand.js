"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const messageCache_1 = require("../../events/messageCache");
// let messageCache : MessageCacheEntery[] = [];
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('test')
        .setDescription('test to get message cache'),
    async execute(interaction) {
        await interaction.reply({ content: JSON.stringify(messageCache_1.messageCache) });
    }
};
