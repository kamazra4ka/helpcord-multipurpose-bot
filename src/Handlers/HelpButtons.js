import {
    EmbedBuilder,
} from 'discord.js';
import {getEmbed} from "./Database/Customization.js";
import {getFooterDetails} from "./getFooterDetails.js";

export const HelpButtons = async (interaction, category) => {

    const footer = await getFooterDetails(interaction);

    const messageId = interaction.message.id;
    let embed;

    console.log(category, messageId)

    switch (category) {
        case 'moderation':
            embed = new EmbedBuilder()
                .setColor(await getEmbed(interaction.guildId))
                .setTitle('Helpcord | Moderation commands')
                .setDescription('Hey! Helpcord is a multipurpose bot that can help you with a variety of tasks. Moderation, fun, economy and much more!\n\n`/kick` - Kick a member from this server.\n`/mute` - Give a timeout (text channels ban) to a member.\n`/ban` - Temporary ban a member from this server.\n`/banlounges` - Ban a member from creating new lounge channels.\n`/punishments` - View user\'s history of punishments.\n`/lock` - Helps you to lock the channel in case of a raid.\n`/unlock` - Unlocks the channel.\n`/slowmode` - Set a precise slowmode for the channel.')
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
                .setTimestamp()
                .setFooter({
                    text: `${footer.footerText}`,
                    iconURL: `${footer.footerIcon}`
                });

            await interaction.update({
                content: '',
                embeds: [embed]
            });
            break;
        case 'entertainment':
            embed = new EmbedBuilder()
                .setColor(await getEmbed(interaction.guildId))
                .setTitle('Helpcord | Entertainment commands')
                .setDescription('Hey! Helpcord is a multipurpose bot that can help you with a variety of tasks. Moderation, fun, economy and much more!\n\n`/meme` - Generates a meme based on server\'s history of messages.\n`/roast` - Analyses and roasts your profile.')
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
                .setTimestamp()
                .setFooter({
                    text: `${footer.footerText}`,
                    iconURL: `${footer.footerIcon}`
                });

            await interaction.update({
                content: '',
                embeds: [embed]
            });
            break;
        case 'economy':

            break;
        case 'server':
            embed = new EmbedBuilder()
                .setColor(await getEmbed(interaction.guildId))
                .setTitle('Helpcord | Server commands')
                .setDescription('Hey! Helpcord is a multipurpose bot that can help you with a variety of tasks. Moderation, fun, economy and much more!\n\n`/adminprogress` - Check your server\'s progress in implementing bot\'s features and receive tips.\n`/loungesetup` - Enable "Lounges" on your server. Members will be able to create their own lounges and then talk there.\n`/setcolor` - Set the color of the embeds for the bot on this server.')
                .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
                .setTimestamp()
                .setFooter({
                    text: `${footer.footerText}`,
                    iconURL: `${footer.footerIcon}`
                });

            await interaction.update({
                content: '',
                embeds: [embed]
            });
            break;
    }
}