"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const messageCache_1 = require("../../events/messageCache");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Snipes the last deleted message! ( has to be within the last 10 messages )')
        .addUserOption((option) => option.setName('user').setDescription('The user to snipe').setRequired(true)),
    async execute(interaction) {
        if (!interaction.guild)
            return;
        try {
            const user = interaction.options.get('user');
            // find the last deleted message from the user
            const deletedMessage = messageCache_1.messageCache.find(entry => entry.authorID === user?.value && entry.deleted);
            if (!deletedMessage) {
                await interaction.reply({ content: 'Sorry, you might be too late! No message to snipe!', ephemeral: true });
            } else {
                // Get the most recent deleted message
                const messageContent = (0, discord_js_1.inlineCode)(deletedMessage.message);
                // Create an embed
                const embed = new discord_js_1.EmbedBuilder()
                    .setAuthor({ name: user?.user?.displayName || 'Unknown User', iconURL: user?.user?.displayAvatarURL() })
                    .setDescription(messageContent)
                    .setFooter({ text: `Deleted: ${new Date(deletedMessage.messageTime).toLocaleTimeString()}` });
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error handling snipe command:', error);
            await interaction.reply({ content: 'An error occurred while trying to snipe the message. Please try again later.', ephemeral: true });
        }
    }
};