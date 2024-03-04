import { PermissionFlagsBits, ChannelType, EmbedBuilder } from 'discord.js';
import {getEmbed} from "../../Handlers/Database/Customization.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";

export const LockTextChannel = async (interaction) => {
    let channel = interaction.options.getChannel('channel'), embed;
    const footer = await getFooterDetails(interaction);
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
