import {ChannelType, EmbedBuilder} from "discord.js";
import {getEmbed} from "../Database/Customization.js";
import {getFooterDetails} from "../getFooterDetails.js";

export const tempVoiceModalHandler = async (interaction, tempChannels, db) => {

    const footer = await getFooterDetails(interaction);
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
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
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
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
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
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
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
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
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
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}