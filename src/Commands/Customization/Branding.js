import {getBranding, getEmbed, turnBranding} from "../../Handlers/Database/Customization.js";
import {EmbedBuilder} from "discord.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";

export const Branding = async (interaction) => {

    const BrandingType = interaction.options.getString('type');

    if (BrandingType === 'server') {
        await turnBranding(interaction.guildId, true);
    } else {
        await turnBranding(interaction.guildId, false);
    }

    let footerText= await getFooterDetails(interaction)
    let footerIcon = await getFooterDetails(interaction)

    const startEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Branding')
        .setDescription(`**${interaction.user.username}**, the branding for the bot's embeds on this server has been turned ${await getBranding(interaction.guildId) ? '**On**' : '**Off**'}.`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214127739729350666/branding.png?ex=65f7fb92&is=65e58692&hm=397d525ce2a68e53a5917daf2afd38f18d1a5012add12c714d401ed002456c5e&=&format=webp&quality=lossless&width=1586&height=431')
        .setTimestamp()
        .setFooter({
            text: `${footerText}`,
            iconURL: `${footerIcon}`
        });

    await interaction.reply({
        content: '',
        embeds: [startEmbed]
    });
}