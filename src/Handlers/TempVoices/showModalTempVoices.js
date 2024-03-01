import {
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder, TextInputBuilder
} from 'discord.js';

export const showModal = async (interaction) => {
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
