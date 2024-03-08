import { PermissionFlagsBits, ChannelType, EmbedBuilder } from 'discord.js';
import {getEmbed} from "../../../Handlers/Database/Customization.js";
import {getFooterDetails} from "../../../Handlers/getFooterDetails.js";
import {checkPermissions} from "../../../Handlers/Permissions.js";

export const LockTextChannel = async (interaction) => {

    let channel = interaction.options.getChannel('channel'), embed;
    const footer = await getFooterDetails(interaction);

    if (!await checkPermissions(interaction, 'MANAGE_CHANNELS')) {
        embed = new EmbedBuilder()
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

    if (!channel) {
        let channel = interaction.channel;
    } else if (channel.type !== ChannelType.GuildText) {

        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, you can only lock text channels.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213061264021127168/lock.png?ex=65f41a56&is=65e1a556&hm=df13deaa51df5a2dc0143185ae8dc59dda99f87f483c6f4560ef8fc4e1b11600&=&format=webp&quality=lossless&width=1440&height=391')
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

    const everyoneRole = interaction.guild.roles.everyone;
    const permissions = channel.permissionOverwrites.cache.get(everyoneRole.id);

    if (permissions && permissions.deny.has(PermissionFlagsBits.SendMessages)) {

        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, the channel is already locked.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213061264021127168/lock.png?ex=65f41a56&is=65e1a556&hm=df13deaa51df5a2dc0143185ae8dc59dda99f87f483c6f4560ef8fc4e1b11600&=&format=webp&quality=lossless&width=1440&height=391')
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } else {
        await channel.permissionOverwrites.edit(everyoneRole, {
            SendMessages: false
        }, {
            reason: 'Channel locked'
        });
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}** locked the channel. No one can send messages in this channel until it's unlocked.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213061264021127168/lock.png?ex=65f41a56&is=65e1a556&hm=df13deaa51df5a2dc0143185ae8dc59dda99f87f483c6f4560ef8fc4e1b11600&=&format=webp&quality=lossless&width=1440&height=391')
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};
