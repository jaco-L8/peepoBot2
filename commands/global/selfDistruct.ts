import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selfdistract')
        .setDescription('1 in 100 chance to self destruct the bot'),
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild) return;

        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownTime = 10 * 60 * 1000; // 10 minutes in milliseconds
        const cooldownEnd = now + cooldownTime;

        // Check if the user is in cooldown
        if (cooldowns.has(userId)) {
            const lastUsed = cooldowns.get(userId);
            const timeLeft = cooldownTime - (now - lastUsed);

            if (timeLeft > 0) {
                const cooldownExpiresAt = Math.floor((lastUsed + cooldownTime) / 1000);
                await interaction.reply({
                    content: `You can only use this command every 10 minutes! Please wait until <t:${cooldownExpiresAt}:R>.`,
                    ephemeral: true,
                });
                return;
            }
        }

        // Update the last used time for this user
        cooldowns.set(userId, now);

        const chance = Math.random();
        if (chance < 0.01) {
            await interaction.reply({ content: `odds=${Math.round(chance * 100)}, self destructing...` });
            await interaction.followUp({ content: 'bye bye :(' });
            process.exit(0);
        } else {
            const cooldownExpiresAt = Math.floor(cooldownEnd / 1000); 
            await interaction.reply({ content: `odds=${Math.round(chance * 100)}, you suck >:(` });
            await interaction.followUp({ content: `nope, try again in <t:${cooldownExpiresAt}:R>` });
        }
    },
};
