import { CommandInteraction, SlashCommandBuilder } from 'discord.js';


const Responses = ['Pong!', 'fuck you!'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply(Responses[Math.floor(Math.random() * Responses.length)]);
    },
};