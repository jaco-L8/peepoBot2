"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!'),
    async execute(interaction) {
        await interaction.reply(`Your username: ${interaction.user.username}\n Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    }
};
