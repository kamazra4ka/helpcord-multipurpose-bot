import { ChannelType, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
let embed;

export const Slowmode = async (interaction) => {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Slowmode')
            .setDescription(`**${interaction.user.username}**, you don't have the required permissions to set slowmode in this channel.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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

    const channel = interaction.options.getChannel('channel');
    if (channel.type !== ChannelType.GuildText) {
        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Slowmode')
            .setDescription(`**${interaction.user.username}**, you can only set slowmode for text channels.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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

    const time = interaction.options.getInteger('time');
    if (time < 0 || time > 21600) {
        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Slowmode')
            .setDescription(`**${interaction.user.username}**, the slowmode time in seconds must be in between of 0 and 21600.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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
        await channel.setRateLimitPerUser(time, `Slowmode set by ${interaction.user.tag}`);

        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Slowmode')
            .setDescription(`**${interaction.user.username}** has set the slowmode for ${channel} to ${time} seconds.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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
        console.error('Failed to set slowmode:', error);

        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Slowmode')
            .setDescription(`**${interaction.user.username}**, I failed to set slowmode for ${channel}. Please try again later or check my permissions.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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
};
