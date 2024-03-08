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
    showModalTempVoices
} from "./Handlers/TempVoices/Modals/showModalTempVoices.js";
import {
    SetupTempVoices
} from "./Commands/TempVoices/SetupTempVoices.js";
import {
    newTempChannelCreation
} from "./Handlers/TempVoices/newTempChannelCreation.js";
import {
    tempVoiceModalHandler
} from "./Handlers/TempVoices/tempVoiceModalHandler.js";
import {GuildLeave} from "./Handlers/Events/Guild/GuildLeave.js";
import {GuildJoin} from "./Handlers/Events/Guild/GuildJoin.js";
import {UserJoin} from "./Handlers/Events/User/UserJoin.js";
import {SetColor} from "./Commands/Customization/setColor.js";
import {Branding} from "./Commands/Customization/Branding.js";
import {welcomeChannelCreate} from "./Commands/Welcome/welcomeChannelCreate.js";
import {welcomeChannelModalHandler} from "./Handlers/Welcome/welcomeChannelModalHandler.js";
import {ModalDeleteWelcomeChannel, ModalEditImage, ModalEditMessage} from "./Handlers/Welcome/Modals/showModalEditWelcome.js";
import {editWelcomeChannel} from "./Handlers/Welcome/editWelcomeChannel.js";
import {RemoveUser} from "./Handlers/Database/Users.js";
import {writeLog} from "./Handlers/Database/Logs.js";
import {checkPunishments} from "./Handlers/Database/Punishments.js";
import {TempVoicesBan} from "./Commands/Moderation/TempVoicesBan.js";

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
            endedPunishments.forEach(punishment => {
                console.log(punishment)
            });
        }
        // 60000
    }, 50000);
});

tempChannels.on("childCreate", async (member, channel, parentChannel) => {
    await newTempChannelCreation(member, channel, parentChannel)
    await writeLog(member.id, member.guild.id, 'TEMP_CHANNEL_CREATE');
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
                await TempVoicesBan(interaction);
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
});

client.login(botToken);