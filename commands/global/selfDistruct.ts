import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selfdistruct')
        .setDescription('Roll a D20: Get 20 to self-destruct the bot, 1-5 to get timed out!'),
    async execute(interaction: CommandInteraction) {
        try {
            if (!interaction.guild) return;

            const userId = interaction.user.id;
            const now = Date.now();
            const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
            const cooldownEnd = now + cooldownTime;

            // Check if the user is in cooldown
            if (cooldowns.has(userId)) {
                const lastUsed = cooldowns.get(userId);
                const timeLeft = cooldownTime - (now - lastUsed);

                if (timeLeft > 0) {
                    const cooldownExpiresAt = Math.floor((lastUsed + cooldownTime) / 1000);
                    await interaction.reply({
                        content: `You're still on cooldown! Please wait until <t:${cooldownExpiresAt}:R>.`,
                        ephemeral: true,
                    });
                    return;
                }
            }

            // Update the last used time for this user
            cooldowns.set(userId, now);

            // Roll a D20
            const roll = Math.floor(Math.random() * 20) + 1; // Generates a number between 1 and 20
            if (roll === 20) {
                // Self-destruct on a 20
                await interaction.reply({ content: `🎲 You rolled a 20! Self-destructing...` });
                await interaction.followUp({ content: 'bye bye :(' });
                console.log('user: ' + interaction.user.displayName + ' self destructed the bot');
                process.exit(0);

            } else if (roll >= 1 && roll <= 5) {
                const timeoutDuration = (6 - roll) * 2 * 60 * 1000; // Duration in milliseconds
                const timeoutDurationMinutes = timeoutDuration / 60000;

                // Get the member object to apply the timeout
                const member = interaction.guild.members.cache.get(userId);
                if (!member) {
                    await interaction.reply({
                        content: `🎲 You rolled a ${roll}, but I couldn't find your member data to apply a timeout.`,
                        ephemeral: true,
                    });
                    return;
                }

                try {
                    // Apply the timeout
                    await member.timeout(timeoutDuration, `Rolled a ${roll} on /selfdistruct command`);

                    // Notify the user
                    await interaction.reply({
                        content: `🎲 You rolled a ${roll}! You're timed out for ${timeoutDurationMinutes} minutes. Please wait until <t:${Math.floor((now + timeoutDuration) / 1000)}:R>.`,
                    });
                } catch (error) {
                    console.error('Error applying timeout:', error);
                    await interaction.reply({
                        content: `🎲 You rolled a ${roll}, but I couldn't apply the timeout. Something went wrong.`,
                        ephemeral: true,
                    });
                }
            } else {
                // Normal roll (6-19)
                const cooldownExpiresAt = Math.floor(cooldownEnd / 1000);
                await interaction.reply({ content: `🎲 You rolled a ${roll}. Nothing happens! Try again in <t:${cooldownExpiresAt}:R>.` });
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
