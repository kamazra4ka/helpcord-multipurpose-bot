import {EmbedBuilder} from "discord.js";
import {getEmbed, setEmbed} from "../../Handlers/Database/Customization.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";
import {checkPermissions} from "../../Handlers/Permissions.js";

export const SetColor = async (interaction) => {

    const color = interaction.options.getString('color');
    const footer = await getFooterDetails(interaction);

    if (!await checkPermissions(interaction, 'MANAGE_GUILD')) {
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

    // check if the color is a valid hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {

        const embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Customization')
            .setDescription(`**${interaction.user.username}**, the color you provided is not a valid HEX color.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214127377035296848/color.png?ex=65f7fb3c&is=65e5863c&hm=1558cd3dc01f074c4c29cfb2d6d848c50f147e4f86e2926b4dae85dd5163f799&=&format=webp&quality=lossless&width=1586&height=431')
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            content: '',
            embeds: [embed],
            ephemeral: true
        });

    } else {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Helpcord | Customization')
            .setDescription(`**${interaction.user.username}**, the color for the bot's embeds on this server has been set to **${color}**.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214127377035296848/color.png?ex=65f7fb3c&is=65e5863c&hm=1558cd3dc01f074c4c29cfb2d6d848c50f147e4f86e2926b4dae85dd5163f799&=&format=webp&quality=lossless&width=1586&height=431')
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            content: '',
            embeds: [embed]
        });

        await setEmbed(interaction.guildId, color);

    }



}