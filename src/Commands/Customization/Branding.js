import {getBranding, getEmbed, turnBranding} from "../../Handlers/Database/Customization.js";
import {EmbedBuilder} from "discord.js";

export const Branding = async (interaction) => {

    const BrandingType = interaction.options.getString('type');

    if (BrandingType === 'server') {
        await turnBranding(interaction.guildId, true);
    } else {
        await turnBranding(interaction.guildId, false);
    }

    await turnBranding(interaction.guildId);

    let footerText, footerIcon;
    if (await getBranding(interaction.guildId)) {
        footerText = 'Helpcord | Multipurpose bot for Discord';
        footerIcon = 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487';
    } else {
        footerText = interaction.guild.name;
        footerIcon = interaction.guild.iconURL();
    }

    const startEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Branding')
        .setDescription(`**${interaction.user.username}**, the branding for the bot's embeds on this server has been switched. You can now see the result in the footer of this message.`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214127739729350666/branding.png?ex=65f7fb92&is=65e58692&hm=397d525ce2a68e53a5917daf2afd38f18d1a5012add12c714d401ed002456c5e&=&format=webp&quality=lossless&width=1586&height=431')
        .setTimestamp()
        .setFooter({
            text: footerText,
            iconURL: footerIcon
        });

    await interaction.reply({
        content: '',
        embeds: [startEmbed]
    });
}