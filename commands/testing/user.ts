import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply(`Your username: ${interaction.user.username}\n Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    }
};

