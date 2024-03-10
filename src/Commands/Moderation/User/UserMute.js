import {getFooterDetails} from "../../../Handlers/getFooterDetails.js";
import {getUserPunishments, writePunishment} from "../../../Handlers/Database/Punishments.js";
import {checkPermissions} from "../../../Handlers/Permissions.js";
import {EmbedBuilder} from "discord.js";
import {getEmbed} from "../../../Handlers/Database/Customization.js";
import ms from "ms";
import {writeLog} from "../../../Handlers/Database/Logs.js";

export const UserMute = async (interaction) => {

    const footer = await getFooterDetails(interaction);

    if (!await checkPermissions(interaction, 'KICK_MEMBERS')) {
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

    if (!user) return interaction.reply({content: 'Please provide a user to mute.', ephemeral: true});
    if (reason.length > 512) return interaction.reply({content: 'The reason cannot be longer than 512 characters.', ephemeral: true});
    if (duration.length > 32) return interaction.reply({content: 'The duration cannot be longer than 32 characters.', ephemeral: true});
    if (user.id === interaction.user.id) return interaction.reply({content: 'You cannot mute yourself.', ephemeral: true});

    try {
        // translate 1m, 1h, 1d, etc to milliseconds
        duration = await ms(duration);
    } catch (e) {
        return interaction.reply({content: 'The duration is not valid.', ephemeral: true});
    }

    if (!duration) return interaction.reply({content: 'The duration is not valid.', ephemeral: true});

    await writePunishment(user.id, interaction.user.id, interaction.guildId, 'SERVER_MUTE', reason, duration);
    await writeLog(interaction.user.id, interaction.guildId, 'GIVE_PUNISHMENT_MUTE');
    await writeLog(user.id, interaction.guildId, 'RECEIVE_PUNISHMENT_MUTE');

    const formattedDuration = ms(duration, {long: true});

    const responseEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Punishments')
        .setDescription(`**${interaction.user.username}**, you have successfully muted **${user.username}** on this server for **${formattedDuration}** with the reason: **${reason}**.`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1215601475967909958/punishments.png?ex=65fd5818&is=65eae318&hm=847c733801a0a0e8d7364481cf78e1b178853b3adf3fb75200512e29a98a55f3&=&format=webp&quality=lossless&width=1057&height=287')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    const member = interaction.guild.members.cache.get(user.id);
    await member.timeout(duration, reason);

    await interaction.reply({
        content: '',
        embeds: [responseEmbed]
    });

}