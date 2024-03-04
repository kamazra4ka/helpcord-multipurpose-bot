import {EmbedBuilder} from "discord.js";
import {getEmbed, setEmbed} from "../../Handlers/Database/Customization.js";

export const SetColor = async (interaction) => {

    const color = interaction.options.getString('color');

    // check if the color is a valid hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {

        const embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Customization')
            .setDescription(`**${interaction.user.username}**, the color you provided is not a valid HEX color.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214127377035296848/color.png?ex=65f7fb3c&is=65e5863c&hm=1558cd3dc01f074c4c29cfb2d6d848c50f147e4f86e2926b4dae85dd5163f799&=&format=webp&quality=lossless&width=1586&height=431')
            .setTimestamp()
            .setFooter({
                text: 'Helpcord | Multipurpose bot for Discord',
                iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
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
                text: 'Helpcord | Multipurpose bot for Discord',
                iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
            });

        await interaction.reply({
            content: '',
            embeds: [embed]
        });

        await setEmbed(interaction.guildId, color);

    }



}