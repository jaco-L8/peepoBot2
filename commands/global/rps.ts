import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const choices = [
    {name: 'rock', value: 'rock'},
    {name: 'paper', value: 'paper'},
    {name: 'scissors', value: 'scissors'}
];



module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Plays rock paper scissors!')
        .addStringOption((option) =>
                option.setName('choice')
                .setDescription('Plays rock paper scissors!')
                .setRequired(true)
                .addChoices(choices)
        ),
    async execute(interaction: CommandInteraction) {

        const gunProbability = 0.05; // 5% chance for gun
        const rand = Math.random();
        
        let botChoice;
        if (rand < gunProbability) {
            botChoice = 'gun';
        } else {
            botChoice = choices[Math.floor(Math.random() * choices.length)].value;;
        }

        const userChoice = interaction.options.get('choice')?.value?.toString();
        if (!userChoice) {
            await interaction.reply('Please choose rock, paper, or scissors!');
            return;
        }

        if (userChoice.toLowerCase() === botChoice) {
            await interaction.reply('It\'s a tie! we both chose ' + userChoice + ' <:PepoThink:1195436748793196574>');
            return; // end the function
        }

        if ((userChoice.toLowerCase() === 'rock' && botChoice === 'scissors') ||
            (userChoice.toLowerCase() === 'paper' && botChoice === 'rock') ||
            (userChoice.toLowerCase() === 'scissors' && botChoice === 'paper')) {
            await interaction.reply(`you chose ${userChoice} <:PepoG:1153039452495675524>...\n you win! I chose ${botChoice} <:Sadge:1153039503028666429>`);
            return;
        }

        if (botChoice === 'gun') {
            await interaction.reply(`Fuck you, I chose gun! <a:ReallyGun:1155244646805540996>`);
            return;
        }

        await interaction.reply(`you chose ${userChoice} <:PepoG:1153039452495675524>... \n I win! I chose ${botChoice} <:peepoHappy:1160682336522883182>`);
    }
}