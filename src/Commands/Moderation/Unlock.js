import {PermissionFlagsBits, ChannelType, EmbedBuilder} from 'discord.js';

export const Unlock = async (interaction) => {
    let channel = interaction.options.getChannel('channel') || interaction.channel, embed;

    if (channel.type !== ChannelType.GuildText) {
        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, you can only unlock text channels.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213061264021127168/lock.png?ex=65f41a56&is=65e1a556&hm=df13deaa51df5a2dc0143185ae8dc59dda99f87f483c6f4560ef8fc4e1b11600&=&format=webp&quality=lossless&width=1440&height=391')
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

    const everyoneRole = interaction.guild.roles.everyone;
    const permissions = channel.permissionOverwrites.cache.get(everyoneRole.id);

    if (permissions && !permissions.deny.has(PermissionFlagsBits.SendMessages)) {
        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}**, the channel you are trying to unlock is not locked`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213061264021127168/lock.png?ex=65f41a56&is=65e1a556&hm=df13deaa51df5a2dc0143185ae8dc59dda99f87f483c6f4560ef8fc4e1b11600&=&format=webp&quality=lossless&width=1440&height=391')
            .setTimestamp()
            .setFooter({
                text: 'Helpcord | Multipurpose bot for Discord',
                iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
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
            .setColor('#041c3c')
            .setTitle('Helpcord | Channel lockdown')
            .setDescription(`**${interaction.user.username}** has unlocked the channel. Everyone can send messages in this channel now.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213061264021127168/lock.png?ex=65f41a56&is=65e1a556&hm=df13deaa51df5a2dc0143185ae8dc59dda99f87f483c6f4560ef8fc4e1b11600&=&format=webp&quality=lossless&width=1440&height=391')
            .setTimestamp()
            .setFooter({
                text: 'Helpcord | Multipurpose bot for Discord',
                iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    }
};