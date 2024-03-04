import {EmbedBuilder} from "discord.js";
import {getEmbed, setEmbed} from "../../Handlers/Database/Customization.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";

export const SetColor = async (interaction) => {

    const color = interaction.options.getString('color');

    const footer = await getFooterDetails(interaction);

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