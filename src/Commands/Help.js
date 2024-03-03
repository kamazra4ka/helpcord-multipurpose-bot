import {
    ActionRowBuilder, ButtonBuilder,
    EmbedBuilder, ButtonStyle
} from 'discord.js';
import {getEmbed} from "../Handlers/Database/Customization.js";

export const Help = async (interaction) => {

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
            text: 'Helpcord | Multipurpose bot for Discord',
            iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
        });

    await interaction.reply({
        content: '',
        components: [row, row2],
        embeds: [startEmbed]
    });
}