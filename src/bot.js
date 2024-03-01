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

    let embed;

    if (interaction.customId === 'setupTempVoicesModal') {
        // Get the data entered by the user
        const channelName = interaction.fields.getTextInputValue('channelName');
        const categoryName = interaction.fields.getTextInputValue('categoryName');
        let maxMembers = 3;
        try {
            maxMembers = parseInt(interaction.fields.getTextInputValue('maxMembers'));
        } catch (e) {
            embed = new EmbedBuilder()
                .setColor('#041c3c')
                .setTitle('Helpcord | Lounge')
                .setDescription(`**${interaction.user.username}**, an error occurred while creating the category or channel. Max members must be a number.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: 'Helpcord | Multipurpose bot for Discord',
                    iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
                });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (isNaN(maxMembers)) {
            embed = new EmbedBuilder()
                .setColor('#041c3c')
                .setTitle('Helpcord | Lounge')
                .setDescription(`**${interaction.user.username}**, an error occurred while creating the category or channel. Max members must be a number.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: 'Helpcord | Multipurpose bot for Discord',
                    iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
                });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        if (!categoryName.trim() || !channelName.trim()) {

            embed = new EmbedBuilder()
                .setColor('#041c3c')
                .setTitle('Helpcord | Lounge')
                .setDescription(`**${interaction.user.username}**, an error occurred while creating the category or channel. Names cannot be empty.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: 'Helpcord | Multipurpose bot for Discord',
                    iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
                });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
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

            embed = new EmbedBuilder()
                .setColor('#041c3c')
                .setTitle('Helpcord | Lounge')
                .setDescription(`**${interaction.user.username}**, you have successfully set up lounges for your server. Members can now join the main channel and create their own lounges.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: 'Helpcord | Multipurpose bot for Discord',
                    iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
                });

            await interaction.reply({
                embeds: [embed],
                ephemeral: false
            });
        } catch (error) {
            console.error('Failed to create category or channel:', error);
            embed = new EmbedBuilder()
                .setColor('#041c3c')
                .setTitle('Helpcord | Lounge')
                .setDescription(`**${interaction.user.username}**, an error occurred while creating the category or channel. Please check bot's permissions and try again.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: 'Helpcord | Multipurpose bot for Discord',
                    iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
                });

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
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