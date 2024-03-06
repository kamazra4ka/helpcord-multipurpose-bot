const { PermissionsBitField } = require('discord.js');

export const checkPermissions = async (interaction, scope) => {
    switch (scope) {
        case 'ADMINISTRATOR':
            return interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
        case 'MANAGE_CHANNELS':
            return interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);
        case 'MANAGE_ROLES':
            return interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
        case 'MANAGE_MESSAGES':
            return interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages);
        case 'BAN_MEMBERS':
            return interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers);
        case 'KICK_MEMBERS':
            return interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers);
        case 'MANAGE_GUILD':
            return interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild);
        case 'VIEW_AUDIT_LOG':
            return interaction.member.permissions.has(PermissionsBitField.Flags.ViewAuditLog);
    }
}
