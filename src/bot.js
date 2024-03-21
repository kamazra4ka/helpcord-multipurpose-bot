import {
    config
} from 'dotenv';
import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    ChannelType,
    Client,
    EmbedBuilder,
    Events,
    GatewayIntentBits
} from 'discord.js';

import { LockTextChannel, UnlockTextChannel, SlowmodeTextChannel, SetupTempVoices,
    Help, SetColor, Branding, welcomeChannelCreate, UserTempVoicesBan, UserBan, UserMute } from './Barrels/BarrelCommands.js';
import { HelpButtons, newTempChannelCreation, tempVoiceModalHandler, GuildLeave,
    GuildJoin, UserJoin, welcomeChannelModalHandler, ModalDeleteWelcomeChannel, ModalEditImage, ModalEditMessage,
    editWelcomeChannel, RemoveUser, writeLog, checkPunishments, endPunishment, getUserPunishments, isLoungeBanned,
    getEmbed, getFooterDetails } from './Barrels/BarrelHandlers.js';

import TempChannels from "@gamers-geek/discord-temp-channels";
import {
    QuickDB
} from "quick.db";
import {UserKick} from "./Commands/Moderation/User/UserKick.js";
import {UserUnmute} from "./Commands/Moderation/User/UserMute.js";
import {UserPunishments} from "./Commands/Moderation/User/UserPunishments.js";
import {notifyUserModAction} from "./Handlers/Moderation/notifyUserModAction.js";
import {Roast} from "./Commands/Enternainment/Roast.js";
import {writeMessage} from "./Handlers/Database/Messages.js";
import {Meme} from "./Commands/Enternainment/Meme.js";

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

    setInterval(async () => {
        const endedPunishments = await checkPunishments();
        if (endedPunishments) {
            for (const punishment of endedPunishments) {
                console.log(punishment)

                let guild, user;

                switch (punishment.punishment_type) {
                    case 'SERVER_BAN':
                        guild = client.guilds.cache.get(punishment.punishment_server_id);
                        try {
                            await guild.members.unban(punishment.punishment_user_id, `Ban has ended`);
                        } catch (e) {
                            console.log(e)
                        }
                        await writeLog(punishment.punishment_user_id, punishment.punishment_server_id,'PUNISHMENT_BAN_END');
                        break;
                    case 'LOUNGES_BAN':
                        await writeLog(punishment.punishment_user_id, punishment.punishment_server_id,'PUNISHMENT_LOUNGES_BAN_END');
                        break;
                    case 'SERVER_MUTE':
                        guild = client.guilds.cache.get(punishment.punishment_server_id);
                        user = await guild.members.fetch(punishment.punishment_user_id);
                        await writeLog(punishment.punishment_user_id, punishment.punishment_server_id,'PUNISHMENT_MUTE_END');
                        break;
                }

                await endPunishment(punishment.punishment_internal_id)
            }
        }
    }, 30000);
});

tempChannels.on("childCreate", async (member, channel, parentChannel) => {

    if (member.user.bot) return;

    if (await isLoungeBanned(member.id, member.guild.id)) {
        setTimeout(async () => {
            await channel.delete();
        }, 2000);

        try {
            const dm = await member.createDM();

            const footer = await getFooterDetails(member.guild.id);
            const userPunishments = await getUserPunishments(member.id, member.guild.id);

            const activeBan = userPunishments.find(punishment => punishment.punishment_type === 'LOUNGES_BAN');
            const moderator = await client.users.fetch(activeBan.punishment_moderator_id);
            const moderatorMention = `<@${moderator.id}>`;
            const reason = activeBan.punishment_reason;

            let endDate = activeBan.punishment_end / 1000;
            endDate = endDate.toString().split('.')[0];
            const discordDate = `<t:${endDate}:F>`

            const embed = new EmbedBuilder()
                .setColor(await getEmbed(channel.guild.id))
                .setTitle('Helpcord | Lounge')
                .setDescription(`**${member.user.username}**, you are currently banned from creating temporary voice channels. If you think this is a mistake, please contact the server staff.\n\n**Moderator:** ${moderatorMention}\n**Reason:** ${reason}\n**End date:** ${discordDate}\n\nIf you want to appeal the ban, please contact the server staff.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: `${footer.footerText}`,
                    iconURL: `${footer.footerIcon}`
                });

            await dm.send({
                embeds: [embed]
            });
        } catch (error) {
            console.error(error);
        }

    } else {
        await newTempChannelCreation(member, channel, parentChannel)
        await writeLog(member.id, member.guild.id, 'TEMP_CHANNEL_CREATE');
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    switch (interaction.customId) {
        case 'setupTempVoicesModal':
            await tempVoiceModalHandler(interaction, tempChannels, db)
            await writeLog(interaction.user.id, interaction.guild.id, 'MODAL_TEMPVOICES');
            break;
        case 'setupWelcomeChannelModal':
            await welcomeChannelModalHandler(interaction)
            await writeLog(interaction.user.id, interaction.guild.id, 'MODAL_WELCOME');
            break;
        case 'editImageModal':
            await editWelcomeChannel(interaction, 'image');
            await writeLog(interaction.user.id, interaction.guild.id, 'MODAL_EDIT_IMAGE');
            break;
        case 'editMessageModal':
            await editWelcomeChannel(interaction, 'message');
            await writeLog(interaction.user.id, interaction.guild.id, 'MODAL_EDIT_MESSAGE');
            break;
        case 'deleteWelcomeModal':
            await editWelcomeChannel(interaction, 'delete');
            await writeLog(interaction.user.id, interaction.guild.id, 'MODAL_DELETE');
            break;
        default:
            break;
    }
});

client.on('guildCreate', async guild => {
    await GuildJoin(guild);
    await writeLog(client.user.id, guild.id, 'GUILD_JOIN');
});

client.on('guildDelete', async guild => {
    await GuildLeave(guild);
    await writeLog(client.user.id, guild.id, 'GUILD_LEAVE');
})

client.on('guildMemberAdd', async member => {
    await UserJoin(member);
    await writeLog(member.id, member.guild.id, 'MEMBER_JOIN');
});

client.on('guildMemberRemove', async member => {
    await RemoveUser(member);
    await writeLog(member.id, member.guild.id, 'MEMBER_LEAVE');
});

client.on('interactionCreate', async interaction => {
    try {

        switch (interaction.commandName) {
            case 'help':
                await Help(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_HELP');
                break;
            case 'lock':
                await LockTextChannel(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_LOCK');
                break;
            case 'unlock':
                await UnlockTextChannel(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_UNLOCK');
                break;
            case 'slowmode':
                await SlowmodeTextChannel(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_SLOWMODE');
                break;
            case 'loungesetup':
                await SetupTempVoices(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_LOUNGESETUP');
                break;
            case 'setcolor':
                await SetColor(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_SETCOLOR');
                break;
            case 'branding':
                await Branding(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_BRANDING');
                break;
            case 'welcome':
                await welcomeChannelCreate(interaction)
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_WELCOME');
                break;
            case 'banlounges':
                await UserTempVoicesBan(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_BANLOUNGES');
                break;
            case 'ban':
                await UserBan(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_BAN');
                break;
            case 'mute':
                await UserMute(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_MUTE');
                break;
            case 'unmute':
                await UserUnmute(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_UNMUTE');
                break;
            case 'kick':
                await UserKick(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_KICK');
                break;
            case 'punishments':
                await UserPunishments(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_PUNISHMENTS');
                break;
            case 'roast':
                await Roast(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_ROAST');
                break;
            case 'meme':
                await Meme(interaction);
                await writeLog(interaction.user.id, interaction.guild.id, 'COMMAND_ROAST');
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

            // if starts from welcome
            if (customId.startsWith('welcome_')) {
                const welcomeId = customId.replace('welcome_', '');
                const command = welcomeId.split('_')[0];
                console.log(command)
                switch (command) {
                    case 'image':
                        await ModalEditImage(interaction);
                        await writeLog(interaction.user.id, interaction.guild.id, 'WELCOME_EDIT_IMAGE');
                        break;
                    case 'message':
                        await ModalEditMessage(interaction);
                        await writeLog(interaction.user.id, interaction.guild.id, 'WELCOME_EDIT_MESSAGE');
                        break;
                    case 'delete':
                        await ModalDeleteWelcomeChannel(interaction);
                        await writeLog(interaction.user.id, interaction.guild.id, 'WELCOME_DELETE');
                        break;
                }
                return;
            }

            switch (customId) {
                case 'help_moderation':
                    await HelpButtons(interaction, 'moderation');
                    await writeLog(interaction.user.id, interaction.guild.id, 'BUTTON_HELP_MODERATION');
                    break;
                case 'help_entertainment':
                    await HelpButtons(interaction, 'entertainment');
                    await writeLog(interaction.user.id, interaction.guild.id, 'BUTTON_HELP_ENTERTAINMENT');
                    break;
                case 'help_economy':
                    await HelpButtons(interaction, 'economy');
                    await writeLog(interaction.user.id, interaction.guild.id, 'BUTTON_HELP_ECONOMY');
                    break;
                case 'help_server':
                    await HelpButtons(interaction, 'server');
                    await writeLog(interaction.user.id, interaction.guild.id, 'BUTTON_HELP_SERVER');
                    break;
            }
        }

    } catch (error) {
        interaction.channel.send(`An error occurred, please try again.\n\n.${error}`);
        await writeLog(interaction.user.id, interaction.guild.id, 'ERROR');
        console.log(error)
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await writeMessage(message.content, message.guild.id);
});

client.login(botToken);