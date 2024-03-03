import {
    config
} from 'dotenv';
import {
    ChannelType,
    Client,
    EmbedBuilder,
    Events,
    GatewayIntentBits
} from 'discord.js';
import {
    LockTextChannel
} from "./Commands/Moderation/LockTextChannel.js";
import {
    Help
} from "./Commands/Help.js";
import {
    HelpButtons
} from "./Handlers/HelpButtons.js";
import {
    UnlockTextChannel
} from "./Commands/Moderation/UnlockTextChannel.js";
import {
    SlowmodeTextChannel
} from "./Commands/Moderation/SlowmodeTextChannel.js";
import TempChannels from "@gamers-geek/discord-temp-channels";
import {
    QuickDB
} from "quick.db";
import {
    showModal
} from "./Handlers/TempVoices/showModalTempVoices.js";
import {
    SetupTempVoices
} from "./Commands/TempVoices/SetupTempVoices.js";
import {
    newTempChannelCreation
} from "./Handlers/TempVoices/newTempChannelCreation.js";
import {
    tempVoiceModalHandler
} from "./Handlers/TempVoices/tempVoiceModalHandler.js";
import {guildJoin} from "./Handlers/Events/GuildJoin.js";

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

const tempChannels = new TempChannels(client);
const db = new QuickDB();
config();
const botToken = process.env.DISCORD_TOKEN;

const defaultChildFormat = (member, count) => `#${count} | ${member.user.username}'s lounge`;

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const tempChannelsData = await db.get("temp-channels") || [];
    console.log(tempChannelsData);

    tempChannelsData.forEach(channelData => {
        const options = {
            ...channelData.options,
            childFormat: defaultChildFormat
        };

        tempChannels.registerChannel(channelData.channelID, options);

    });
});

tempChannels.on("childCreate", async (member, channel, parentChannel) => {
    await newTempChannelCreation(member, channel, parentChannel)
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'setupTempVoicesModal') {
        await tempVoiceModalHandler(interaction, tempChannels, db)
    }
});

client.on('guildCreate', async guild => {
    await guildJoin(guild);
});

client.on('guildMemberAdd', member => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);

});

client.on('interactionCreate', async interaction => {
    try {

        switch (interaction.commandName) {
            case 'help':
                await Help(interaction);
                break;
            case 'lock':
                await LockTextChannel(interaction);
                break;
            case 'unlock':
                await UnlockTextChannel(interaction);
                break;
            case 'slowmode':
                await SlowmodeTextChannel(interaction);
                break;
            case 'loungesetup':
                await SetupTempVoices(interaction);
                break;
            default:
                break;
        }

        if (interaction.isButton()) {
            const customId = interaction.customId;

            // if starts from invite
            if (customId.startsWith('invite_')) {
                await interaction.deferUpdate();
                const inviteLink = customId.replace('invite_', '');
                await interaction.followUp(`Invite your friends to the lounge: ${inviteLink}`);
                return;
            }

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
                case 'help_server':
                    await HelpButtons(interaction, 'server');
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