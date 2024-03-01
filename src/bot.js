import {
    config
} from 'dotenv';
import {
    Client,
    EmbedBuilder,
    GatewayIntentBits
} from 'discord.js';
import {
    Lock
} from "./Commands/Moderation/Lock.js";
import {Help} from "./Commands/Help.js";
import {HelpButtons} from "./Handlers/HelpButtons.js";
import {Unlock} from "./Commands/Moderation/Unlock.js";
import {Slowmode} from "./Commands/Moderation/Slowmode.js";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ],
});

import TempChannels from "@gamers-geek/discord-temp-channels";
const tempChannels = new TempChannels(client);

config();
const botToken = process.env.DISCORD_TOKEN;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Register a new main channel
    tempChannels.registerChannel("1212377559669669931", {
        childCategory: "1213073348838297631",
        childAutoDeleteIfEmpty: true,
        childMaxUsers: 3,
        childFormat: (member, count) => `#${count} | ${member.user.username}'s lounge`
    });
});

client.on('interactionCreate', async interaction => {
    try {

        switch (interaction.commandName) {
            case 'help':
                await Help(interaction);
                break;
            case 'lock':
                await Lock(interaction);
                break;
            case 'unlock':
                await Unlock(interaction);
                break;
            case 'slowmode':
                await Slowmode(interaction);
                break;
            default:
                break;
        }

        if (interaction.isButton()) {
            const customId = interaction.customId;
            const embed = new EmbedBuilder();

            switch (customId) {
                case 'help_moderation':
                    await HelpButtons(interaction, 'moderation');
                    break;
                case 'help_entertainment':
                    await HelpButtons(interaction, 'entertainment');
                    break;
                case 'help_economy':
                    await HelpButtons(interaction, 'economy');
                    break;
            }
        }

    } catch (error) {
        interaction.channel.send(`An error occurred, please try again.\n\n.${error}`);
        console.log(error)
    }
});


 client.on('messageCreate', async (message) => {
     if (message.author.bot) return;
 });

client.login(botToken);