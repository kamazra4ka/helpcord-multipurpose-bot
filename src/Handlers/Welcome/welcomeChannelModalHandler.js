import {addWelcomeChannel} from "../Database/Welcome.js";
import {ChannelType, EmbedBuilder} from "discord.js";
import {getEmbed} from "../Database/Customization.js";
import {getFooterDetails} from "../getFooterDetails.js";

export const welcomeChannelModalHandler = async (interaction) => {
    // get info from modal fields
    const channelName = interaction.fields.getTextInputValue('channelName');
    const channelMessage = interaction.fields.getTextInputValue('channelMessage');

    console.log(channelName, channelMessage);

    const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
    });

    await addWelcomeChannel(interaction.guildId, channel.id, channelMessage);

    const footer = await getFooterDetails(interaction);

    const startEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Welcome Setup')
        .setDescription(`**${interaction.user.username}**, you have successfully created a welcome channel. You can now use the welcome channel to greet new members. If you want to edit settings of the welcome channel, please use the buttons below.\n\n**Welcome channel:** <#${channel.id}>`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    await interaction.reply({
        content: '',
      //  components: [row, row2],
        embeds: [startEmbed]
    });
}