import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { messageCache } from "../../events/messageCache";

// let messageCache : MessageCacheEntery[] = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('test to get message cache'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply({ content: JSON.stringify(messageCache) });
    }
}