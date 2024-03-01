import {
    config
} from 'dotenv';
import {
    ChannelType,
    Client,
    EmbedBuilder, Events,
    GatewayIntentBits
} from 'discord.js';
import {
    LockTextChannel
} from "./Commands/Moderation/LockTextChannel.js";
import {Help} from "./Commands/Help.js";
import {HelpButtons} from "./Handlers/HelpButtons.js";
import {UnlockTextChannel} from "./Commands/Moderation/UnlockTextChannel.js";
import {SlowmodeTextChannel} from "./Commands/Moderation/SlowmodeTextChannel.js";
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
import {QuickDB} from "quick.db";
const db = new QuickDB();

import {showModal} from "./Handlers/TempVoices/showModalTempVoices.js";
import {SetupTempVoices} from "./Commands/TempVoices/SetupTempVoices.js";
const tempChannels = new TempChannels(client);


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


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'setupTempVoicesModal') {
        // Get the data entered by the user
        const channelName = interaction.fields.getTextInputValue('channelName');
        const categoryName = interaction.fields.getTextInputValue('categoryName');
        let maxMembers = 3;
        try {
            maxMembers = parseInt(interaction.fields.getTextInputValue('maxMembers'));
        } catch (e) {
            await interaction.reply({content: 'Max members must be a number', ephemeral: true});
        }

        if (isNaN(maxMembers)) {
            await interaction.reply({content: 'Max members must be a number', ephemeral: true});
            return;
        }

        if (!categoryName.trim() || !channelName.trim()) {
            await interaction.reply({ content: 'Category name or channel name cannot be empty.', ephemeral: true });
            return;
        }

        try {
            const category = await interaction.guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
            });

            const mainChannel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildVoice,
                parent: category.id,
            });

            await tempChannels.registerChannel(mainChannel.id, {
                childCategory: category.id,
                childAutoDeleteIfEmpty: true,
                childMaxUsers: maxMembers,
                childFormat: (member, count) => `#${count} | ${member.user.username}'s lounge`
            });

            let options = {
                childCategory: category.id,
                childAutoDeleteIfEmpty: true,
                childMaxUsers: maxMembers,
                childFormat: (member, count) => `#${count} | ${member.user.username}'s lounge`
            }

            await db.push("temp-channels", {
                channelID: mainChannel.id,
                options: options
            });

            await interaction.reply({ content: `blah blah blah`, ephemeral: true });
        } catch (error) {
            console.error('Failed to create category or channel:', error);
            await interaction.reply({ content: 'Failed to create category or channel. Please check the bot permissions and try again.', ephemeral: true });
        }

    }
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
            case 'voicesetup':
                await SetupTempVoices(interaction);
                break;
            default:
                break;
        }

        if (interaction.isButton()) {
            const customId = interaction.customId;

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