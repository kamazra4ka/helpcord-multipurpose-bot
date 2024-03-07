import {
    ActionRowBuilder,
    TextInputStyle,
    ModalBuilder, TextInputBuilder, EmbedBuilder
} from 'discord.js';
import {checkPermissions} from "../Permissions.js";
import {getEmbed} from "../Database/Customization.js";
import {getFooterDetails} from "../getFooterDetails.js";
import {getWelcome} from "../Database/Welcome.js";

export const ModalEditImage = async (interaction) => {

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
            .setCustomId('editImageModal')
            .setTitle('Edit image');

        const channelImage = new TextInputBuilder()
            .setCustomId('channelImage')
            .setLabel('Welcome image background URL')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(512)
            .setPlaceholder('Leave empty to use a default image')
            .setRequired(false);

        const secondActionRow = new ActionRowBuilder().addComponents(channelImage);

        modal.addComponents(secondActionRow);

        await interaction.showModal(modal);
};

export const ModalEditMessage = async (interaction) => {

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

    const currentWelcome = await getWelcome(interaction.guild.id);
    const currentMessage = currentWelcome.welcome_message;

    const modal = new ModalBuilder()
        .setCustomId('editMessageModal')
        .setTitle('Edit message');

    const categoryNameInput = new TextInputBuilder()
        .setCustomId('channelMessage')
        .setLabel('Message')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(1)
        .setMaxLength(2000)
        .setValue(`${currentMessage}`)
        .setPlaceholder('Use \$count for the member count, \$user for the user\'s name and \$server for the server name.')
        .setRequired(true);

    const secondActionRow = new ActionRowBuilder().addComponents(categoryNameInput);

    modal.addComponents(secondActionRow);

    await interaction.showModal(modal);
};

export const ModalDeleteWelcomeChannel = async (interaction) => {

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
        .setCustomId('deleteWelcomeModal')
        .setTitle('Welcome channel deletion');

    const confirmField = new TextInputBuilder()
        .setCustomId('confirmDelete')
        .setLabel('Confirm deletion')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(6)
        .setPlaceholder('Type DELETE to confirm')
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(confirmField);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
};