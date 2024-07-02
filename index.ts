import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';


// initialise dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// define command interface
interface Command {
    data: {
        name: string;
    }
    execute: (interaction: any) => any;
}

// Extend the Client class to include a commands Collection
class CustomClient extends Client {
    commands: Collection<string, Command>;

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds] });
        this.commands = new Collection();
    }
}

// create a new client instance
const client = new CustomClient();

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);



//create a collection
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
};

// recieve interactions

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = (interaction.client as CustomClient).commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
});
