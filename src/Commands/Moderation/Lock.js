import { PermissionFlagsBits, ChannelType } from 'discord.js';

export const Lock = async (interaction) => {
    let channel = interaction.options.getChannel('channel');
    if (!channel) {
        let channel = interaction.channel;
    } else if (channel.type !== ChannelType.GuildText) {
        await interaction.reply({
            content: '🔑 You can only lock text channels.',
            ephemeral: true
        });
        return;
    }

    const everyoneRole = interaction.guild.roles.everyone;
    const permissions = channel.permissionOverwrites.cache.get(everyoneRole.id);

    if (permissions && permissions.deny.has(PermissionFlagsBits.SendMessages)) {
        await interaction.reply({
            content: '🔒 The channel is already locked.',
            ephemeral: true
        });
    } else {
        await channel.permissionOverwrites.edit(everyoneRole, {
            SendMessages: false
        }, {
            reason: 'Channel locked'
        });
        await interaction.reply({
            content: '🔒 The channel has been locked.',
            ephemeral: true
        });
    }
};
