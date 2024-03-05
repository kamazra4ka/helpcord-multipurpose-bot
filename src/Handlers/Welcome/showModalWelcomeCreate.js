import {
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder, TextInputBuilder
} from 'discord.js';

export const showModalWelcomeCreate = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('setupWelcomeChannelModal')
        .setTitle('Welcome Setup');

    const channelNameInput = new TextInputBuilder()
        .setCustomId('channelName')
        .setLabel('Welcome channel name')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(32)
        .setValue('👋-welcome')
        .setPlaceholder('Enter the welcome/greetings channel name')
        .setRequired(true);

    const categoryNameInput = new TextInputBuilder()
        .setCustomId('channelMessage')
        .setLabel('Message')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(1)
        .setMaxLength(2000)
        .setValue('**\$count** | Hey, **\$user**! Welcome to **\$server**! We hope you enjoy your stay!')
        .setPlaceholder('Use \$count for the member count, \$user for the user\'s name and \$server for the server name.')
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(channelNameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(categoryNameInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
};
