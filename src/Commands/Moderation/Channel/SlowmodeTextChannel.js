import { ChannelType, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import {getEmbed} from "../../../Handlers/Database/Customization.js";
import {getFooterDetails} from "../../../Handlers/getFooterDetails.js";
import {checkPermissions} from "../../../Handlers/Permissions.js";
let embed;

export const SlowmodeTextChannel = async (interaction) => {
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

    const channel = interaction.options.getChannel('channel');
    if (channel.type !== ChannelType.GuildText) {
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | SlowmodeTextChannel')
            .setDescription(`**${interaction.user.username}**, you can only set slowmode for text channels.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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

    const time = interaction.options.getInteger('time');
    if (time < 0 || time > 21600) {
        embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | SlowmodeTextChannel')
            .setDescription(`**${interaction.user.username}**, the slowmode time in seconds must be in between of 0 and 21600.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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
        await channel.setRateLimitPerUser(time, `Slowmode set by ${interaction.user.tag}`);

        if (time === 0) {
            embed = new EmbedBuilder()
                .setColor(await getEmbed(interaction.guildId))
                .setTitle('Helpcord | Slowmode')
                .setDescription(`**${interaction.user.username}** has removed slowmode for ${channel}.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: `${footer.footerText}`,
                    iconURL: `${footer.footerIcon}`
                });
        } else {
            embed = new EmbedBuilder()
                .setColor('#041c3c')
                .setTitle('Helpcord | SlowmodeTextChannel')
                .setDescription(`**${interaction.user.username}** has set the slowmode for ${channel} to ${time} seconds.`)
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
                .setTimestamp()
                .setFooter({
                    text: `${footer.footerText}`,
                    iconURL: `${footer.footerIcon}`
                });
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    } catch (error) {
        console.error('Failed to set slowmode:', error);

        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | SlowmodeTextChannel')
            .setDescription(`**${interaction.user.username}**, I failed to set slowmode for ${channel}. Please try again later or check my permissions.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213069333241274368/slowmode.png?ex=65f421da&is=65e1acda&hm=ad202b710a8ff2aebb81f5024766e0b9bf71a317f27fed5bc2504460a3ba8831&=&format=webp&quality=lossless&width=1440&height=391')
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
};
