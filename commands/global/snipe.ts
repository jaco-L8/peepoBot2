import { CommandInteraction, SlashCommandBuilder, inlineCode, EmbedBuilder } from "discord.js";
import { messageCache } from "../../events/messageCache";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Snipes the last deleted message! ( has to be within the last 10 messages )')
        .addUserOption((option) => option.setName('user').setDescription('The user to snipe').setRequired(true)),
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild) return;
        const user = interaction.options.get('user');

        // find the last deleted message from the user
        const deletedMessage = messageCache.find(entry => entry.authorID === user?.value && entry.deleted);

        if (!deletedMessage) {
            await interaction.reply({ content: 'Sorry, you might be too late! No message to snipe!', ephemeral: true });
        } else {
            // Get the most recent deleted message
            const messageContent = inlineCode(deletedMessage.message);

            // Create an embed
            const embed = new EmbedBuilder()
                .setColor(Math.random() * 0xffffff)
                .setAuthor({ name: user?.user?.displayName || 'Unknown User', iconURL: user?.user?.displayAvatarURL() })
                .setDescription(messageContent)
                .setFooter({ text: `Deleted: ${new Date(deletedMessage.messageTime).toLocaleTimeString()}` });
                
            await interaction.reply({ embeds: [embed] });
        }
    }
}