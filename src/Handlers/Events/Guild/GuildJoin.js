import {newGuild} from "../../Database/Guilds.js";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from "discord.js";
import {addAllMembers} from "../../Database/Users.js";
import {getFooterDetails} from "../../getFooterDetails.js";

export const GuildJoin = async (guild) => {

    const footer = await getFooterDetails(guild.id);

    await newGuild(guild);
    await addAllMembers(guild);

    // get guild's system channel
    const systemChannel = guild.systemChannel;
    if (!systemChannel) return;

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
        .setColor('#041c3c')
        .setTitle('Helpcord | Commands')
        .setDescription('Hey! Thanks for inviting Helpcord to your server. Helpcord is a multipurpose bot that can help you with a variety of tasks. Moderation, fun, economy and much more! Please choose a category to get a list of commands.')
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    try {
        await systemChannel.send({
            content: '',
            components: [row, row2],
            embeds: [startEmbed]
        });
    } catch (error) {
        console.error('Failed to send message:', error);
    }

}