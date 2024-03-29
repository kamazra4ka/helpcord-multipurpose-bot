import ms from "ms";
import {EmbedBuilder} from "discord.js";
import { getFooterDetails, checkPermissions, getEmbed, getUserPunishments, writePunishment, writeLog } from '../../../Barrels/BarrelHandlers.js';
import {notifyUserModAction} from "../../../Handlers/Moderation/notifyUserModAction.js";

export const UserTempVoicesBan = async interaction => {

    const footer = await getFooterDetails(interaction);
    const userPunishments = await getUserPunishments(interaction.user.id, interaction.guildId);

    if (!await checkPermissions(interaction, 'BAN_MEMBERS')) {
        const embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Permissions')
            .setDescription(`**${interaction.user.username}**, you don't have the required permissions to continue with this action.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214942980490665994/permissions.png?ex=65faf2d3&is=65e87dd3&hm=f678dd79a9ea3f583e703b43a40acd14286b248e20958c3bbbb3625df39217ec&=&format=webp&quality=lossless&width=1921&height=521')
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
        return;
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    let duration = interaction.options.getString('duration');

    if (!user) return interaction.reply({content: 'Please provide a user to ban.', ephemeral: true});
    if (reason.length > 512) return interaction.reply({content: 'The reason cannot be longer than 512 characters.', ephemeral: true});
    if (duration.length > 32) return interaction.reply({content: 'The duration cannot be longer than 32 characters.', ephemeral: true});

    if (userPunishments) {
        // check if the user has already active bans from lounge
        const activeBan = userPunishments.find(punishment => punishment.punishment_type === 'LOUNGES_BAN');
        if (activeBan) {
            return interaction.reply({content: 'This user already has an active ban from the temporary voice channels.', ephemeral: true});
        }
    }

    try {
        // translate 1m, 1h, 1d, etc to milliseconds
        duration = await ms(duration);
    } catch (e) {
        return interaction.reply({content: 'The duration is not valid.', ephemeral: true});
    }

    if (!duration) return interaction.reply({content: 'The duration is not valid.', ephemeral: true});

    await writePunishment(user.id, interaction.user.id, interaction.guildId, 'LOUNGES_BAN', reason, duration);
    await writeLog(interaction.user.id, interaction.guildId, 'GIVE_PUNISHMENT_LOUNGESBAN');
    await writeLog(user.id, interaction.guildId, 'RECEIVE_PUNISHMENT_LOUNGESBAN');

    const formattedDuration = ms(duration, {long: true});

    const responseEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Punishments')
        .setDescription(`**${interaction.user.username}**, you have successfully banned **${user.username}** from the temporary voice channels for **${formattedDuration}** with the reason: **${reason}**.`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1215601475967909958/punishments.png?ex=65fd5818&is=65eae318&hm=847c733801a0a0e8d7364481cf78e1b178853b3adf3fb75200512e29a98a55f3&=&format=webp&quality=lossless&width=1057&height=287')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    await interaction.reply({
        content: '',
        embeds: [responseEmbed]
    });

    const now = new Date().getTime();
    duration = now + duration;
    await notifyUserModAction(interaction.guild, user, interaction.user.id, {punishment_type: 'LOUNGES_BAN', punishment_reason: reason, punishment_end: duration, punishment_start: now}, false);

};