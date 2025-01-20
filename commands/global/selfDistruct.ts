import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client, initializeClient } from '../../index';
import * as dotenv from 'dotenv';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('killbot')
        .setDescription('Roll a D20: if it lands on a 20, the bot dies, if it lands on anything else you get timed out :3'),
    async execute(interaction: CommandInteraction) {
        try {
            if (!interaction.guild) return;

            const userId = interaction.user.id;
            const roll = Math.floor(Math.random() * 20) + 1;

            if (roll === 20) {
                await interaction.reply({ content: `🎲 You rolled a 20! Self-destructing...` });
                await interaction.followUp({ content: 'bye bye :(' });
                console.log('user: ' + interaction.user.displayName + ' self destructed the bot');
                
                // Destroy the current client
                await client.destroy();
                
                // wait two hours before restarting
                setTimeout(async () => {
                    try {
                        // Create a new client instance
                        const newClient = initializeClient();
                        await newClient.login(process.env.TOKEN);
                        console.log('Bot has been restarted with a new client instance!');
                    } catch (error) {
                        console.error('Failed to restart bot:', error);
                    }
                }, 7200000);
            } else {
                // Fixed timeout durations (1 = 60 min, 2 = 45 min, ..., 19 = 1 min)
                const maxDurationMinutes = 60;
                const minDurationMinutes = 1;
                const decrementPerRoll = (maxDurationMinutes - minDurationMinutes) / 18;
                const timeoutDurationMinutes = maxDurationMinutes - ((roll - 1) * decrementPerRoll);

                const timeoutDuration = timeoutDurationMinutes * 60 * 1000; // Convert to milliseconds
                const member = interaction.guild.members.cache.get(userId);

                if (!member) {
                    await interaction.reply({
                        content: `🎲 You rolled a ${roll}, but I couldn't find your member data to apply a timeout.`,
                        ephemeral: true,
                    });
                    return;
                }

                try {
                    await member.timeout(timeoutDuration, `Rolled a ${roll} on /selfdistruct command`);
                    await interaction.reply({
                        content: `🎲 You rolled a ${roll}! You're timed out for ${timeoutDurationMinutes.toFixed(0)} minutes.`,
                    });
                } catch (error) {
                    console.error('Error applying timeout:', error);
                    await interaction.reply({
                        content: `🎲 You rolled a ${roll}, but I couldn't apply the timeout. Something went wrong.`,
                        ephemeral: true,
                    });
                }
            }
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    },
};
