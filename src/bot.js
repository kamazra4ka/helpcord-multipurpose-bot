import {
    config
} from 'dotenv';
import {
    Client,
    EmbedBuilder,
    GatewayIntentBits
} from 'discord.js';
import {Help} from "./Commands/Help.js";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

config();
const botToken = process.env.DISCORD_TOKEN;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    try {

        switch (interaction.commandName) {
            case 'help':
                await Help(interaction);
                break;
            default:
                break;
        }

        if (interaction.isButton()) {

        }

    } catch (error) {
        interaction.channel.send(`An error occurred, please try again.\n\n.${error}`);
        console.log(error)
    }
});

// client.on('messageCreate', async (message) => {
//     if (message.author.bot) return;
// });

client.login(botToken);