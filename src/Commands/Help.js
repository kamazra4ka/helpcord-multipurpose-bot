import {
    ActionRowBuilder, ButtonBuilder,
    EmbedBuilder, ButtonStyle
} from 'discord.js';
import {getEmbed} from "../Handlers/Database/Customization.js";
import {getFooterDetails} from "../Handlers/getFooterDetails.js";

export const Help = async (interaction) => {

    const footer = await getFooterDetails(interaction);

    const WebsiteButton = new ButtonBuilder()
        .setLabel('Website')
        .setURL('https://kamazra4ka.nl')
        .setStyle(ButtonStyle.Link);

    const ModerationButton = new ButtonBuilder()
        .setLabel('🛡️ Moderation')
        .setCustomId('help_moderation')
        .setStyle(ButtonStyle.Secondary);

    const FunButton = new ButtonBuilder()
        .setLabel('🎉 Entertainment')
        .setCustomId('help_entertainment')
        .setStyle(ButtonStyle.Secondary);

    const EconomyButton = new ButtonBuilder()
        .setLabel('🏦 Economy')
        .setCustomId('help_economy')
        .setStyle(ButtonStyle.Secondary);

    const ServerButton = new ButtonBuilder()
        .setLabel('⚙️ Server Management')
        .setCustomId('help_server')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(FunButton).addComponents(ModerationButton).addComponents(EconomyButton);
    const row2 = new ActionRowBuilder().addComponents(ServerButton).addComponents(WebsiteButton);

    const startEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Commands')
        .setDescription('Hey! Helpcord is a multipurpose bot that can help you with a variety of tasks. Moderation, fun, economy and much more! Please choose a category to get continue.')
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    await interaction.reply({
        content: '',
        components: [row, row2],
        embeds: [startEmbed]
    });
}