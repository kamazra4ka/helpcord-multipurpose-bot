import {showModalWelcomeCreate} from "../../Handlers/Welcome/showModalWelcomeCreate.js";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from "discord.js";
import {getEmbed} from "../../Handlers/Database/Customization.js";
import {checkWelcome, getWelcomeChannel} from "../../Handlers/Database/Welcome.js";
import {getFooterDetails} from "../../Handlers/getFooterDetails.js";

export const welcomeChannelCreate = async (interaction) => {
    if (!await checkWelcome(interaction.guild.id)) {
        await showModalWelcomeCreate(interaction)
    } else {
        const footer = await getFooterDetails(interaction);

        const channel = await getWelcomeChannel(interaction.guild.id);
        console.log(channel)

        const editImage = new ButtonBuilder()
            .setLabel('🌆 Edit image')
            .setCustomId(`welcome_image_${channel.welcome_channel_id}`)
            .setStyle(ButtonStyle.Secondary);

        const editMessage = new ButtonBuilder()
            .setLabel('✏️ Edit message')
            .setCustomId(`welcome_message_${channel.welcome_channel_id}`)
            .setStyle(ButtonStyle.Secondary);

        const deleteChannel = new ButtonBuilder()
            .setLabel('🗑️ Delete channel')
            .setCustomId(`welcome_delete_${channel.welcome_channel_id}`)
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(editImage).addComponents(editMessage).addComponents(deleteChannel);

        const startEmbed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setTitle('Helpcord | Welcome Setup')
            .setDescription(`**${interaction.user.username}**, you already have a welcome channel set up. If you want to edit settings of the welcome channel, please use the buttons below.\n\nWelcome channel was deleted? Click on the button to remove it from the system.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213043629602639872/help.png?ex=65f409ea&is=65e194ea&hm=354028e7a08cc45e8657c5f3ecb80b0d5eca5d56243e6ffa0d357b2944961bce&=&format=webp&quality=lossless&width=687&height=186')
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        await interaction.reply({
            content: '',
            components: [row],
            embeds: [startEmbed]
        });
    }
}