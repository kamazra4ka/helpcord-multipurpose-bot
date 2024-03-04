import {PermissionFlagsBits, ChannelType, EmbedBuilder} from 'discord.js';
import {getEmbed} from "../../Handlers/Database/Customization.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";

export const UnlockTextChannel = async (interaction) => {
    const footer = await getFooterDetails(interaction);
    let channel = interaction.options.getChannel('channel') || interaction.channel, embed;

    // if the user doesn't have the required permissions to unlock the channel
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, you don't have the required permissions to unlock this channel.`)
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

    if (channel.type !== ChannelType.GuildText) {
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, you can only unlock text channels.`)
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

    if (permissions && !permissions.deny.has(PermissionFlagsBits.SendMessages)) {
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, the channel you are trying to unlock is not locked`)
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
            SendMessages: null
        }, {
            reason: 'Channel unlocked'
        });
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}** has unlocked the channel. Everyone can send messages in this channel now.`)
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