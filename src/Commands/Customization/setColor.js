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
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
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

        return;
    }

    await setEmbed(interaction.guildId, color);

}