import {ChannelType, EmbedBuilder} from "discord.js";
import {getEmbed} from "../Database/Customization.js";

export const tempVoiceModalHandler = async (interaction, tempChannels, db) => {
    let embed;
    // Get the data entered by the user
    const channelName = interaction.fields.getTextInputValue('channelName');
    const categoryName = interaction.fields.getTextInputValue('categoryName');
    let maxMembers = 3;
    try {
        maxMembers = parseInt(interaction.fields.getTextInputValue('maxMembers'));
    } catch (e) {
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
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
            .setColor(await getEmbed(interaction.guildId))
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
            .setColor(await getEmbed(interaction.guildId))
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
            .setColor(await getEmbed(interaction.guildId))
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
            .setColor(await getEmbed(interaction.guildId))
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