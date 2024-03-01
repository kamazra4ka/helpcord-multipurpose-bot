import { PermissionsBitField } from 'discord.js';

export const newTempChannelCreation = async (member, channel, parentChannel) => {
    // give the member all permissions except for moving members into the channel
    await channel.permissionOverwrites.edit(member.id, {
        [PermissionsBitField.Flags.ManageChannels]: true,
        [PermissionsBitField.Flags.ViewChannel]: true,
        [PermissionsBitField.Flags.Speak]: true,
        [PermissionsBitField.Flags.UseVAD]: true,
    });
}
