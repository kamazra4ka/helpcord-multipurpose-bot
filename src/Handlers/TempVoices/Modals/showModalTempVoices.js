import {
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder, TextInputBuilder, EmbedBuilder
} from 'discord.js';
import {getFooterDetails} from "../../getFooterDetails.js";
import {checkPermissions} from "../../Permissions.js";
import {getEmbed} from "../../Database/Customization.js";

export const showModalTempVoices = async (interaction) => {

    const footer = await getFooterDetails(interaction);

    if (!await checkPermissions(interaction, 'MANAGE_GUILD')) {
        const embed = new EmbedBuilder()
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

    const modal = new ModalBuilder()
        .setCustomId('setupTempVoicesModal')
        .setTitle('Lounge Setup');

    const channelNameInput = new TextInputBuilder()
        .setCustomId('channelName')
        .setLabel('Channel Name')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(32)
        .setValue('➕ Create a lounge')
        .setPlaceholder('Enter the main channel name')
        .setRequired(true);

    const categoryNameInput = new TextInputBuilder()
        .setCustomId('categoryName')
        .setLabel('Category Name')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(32)
        .setValue('🗣️ User Lounges')
        .setPlaceholder('Enter the category name (optional)')
        .setRequired(true);

    const categoryMaxMembers = new TextInputBuilder()
        .setCustomId('maxMembers')
        .setLabel('Max Members')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(2)
        .setValue('8')
        .setPlaceholder('Enter the members limit (optional)')
        .setRequired(false);

    const firstActionRow = new ActionRowBuilder().addComponents(channelNameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(categoryNameInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(categoryMaxMembers);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);
};
