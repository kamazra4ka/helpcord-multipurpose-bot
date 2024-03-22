import {getBranding, getEmbed, turnBranding} from "../../Handlers/Database/Customization.js";
import {EmbedBuilder} from "discord.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";
import {checkPermissions} from "../../Handlers/Permissions.js";

export const Branding = async (interaction) => {

    let footer= await getFooterDetails(interaction)

    if (!await checkPermissions(interaction, 'MANAGE_GUILD')) {
        let embed = new EmbedBuilder()
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

    const BrandingType = interaction.options.getString('type');

    if (BrandingType === 'server') {
        await turnBranding(interaction.guildId, true);
    } else {
        await turnBranding(interaction.guildId, false);
    }

    footer = await getFooterDetails(interaction);

    const startEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Branding')
        .setDescription(`**${interaction.user.username}**, the branding for the bot's embeds on this server has been turned ${await getBranding(interaction.guildId) ? '**On**' : '**Off**'}.`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1214127739729350666/branding.png?ex=65f7fb92&is=65e58692&hm=397d525ce2a68e53a5917daf2afd38f18d1a5012add12c714d401ed002456c5e&=&format=webp&quality=lossless&width=1586&height=431')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    await interaction.reply({
        content: '',
        embeds: [startEmbed]
    });
}