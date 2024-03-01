import {PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js';

export const newTempChannelCreation = async (member, channel, parentChannel) => {

    let embed;

    // give the member all permissions except for moving members into the channel
    try {
        await channel.permissionOverwrites.edit(member.id, {
            [PermissionsBitField.Flags.ManageChannels]: true,
            [PermissionsBitField.Flags.ViewChannel]: true,
            [PermissionsBitField.Flags.Speak]: true,
            [PermissionsBitField.Flags.UseVAD]: true,
        });
    } catch (error) {
        console.error(error);

    }

    // dm the member with the channel link
    try {
        const dm = await member.createDM();

        const inviteLink = await channel.createInvite();

        const WebsiteButton = new ButtonBuilder()
            .setLabel('🌴 Go to the lounge')
            .setURL(`https://discord.com/channels/${channel.guild.id}/${channel.id}`)
            .setStyle(ButtonStyle.Link);

        const InviteButton = new ButtonBuilder()
            .setLabel('➕ Invite friends to the lounge')
            .setCustomId(`invite_${inviteLink.url}`)
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(WebsiteButton).addComponents(InviteButton);

        embed = new EmbedBuilder()
            .setColor('#041c3c')
            .setTitle('Helpcord | Lounge')
            .setDescription(`**${member.user.username}**, you have created a new lounge. You can invite your friends and talk there.\n\nYou can edit the name of the lounge and other settings (such as the limit of members) by clicking on the settings icon next to the channel name.`)
            .setImage('https://media.discordapp.net/attachments/1212377559669669930/1213106150569152512/lounges.png?ex=65f44424&is=65e1cf24&hm=11e6f2b230a5c1ffdf4f389461fd4959a181a1e613caec8fce40a2804975cf8d&=&format=webp&quality=lossless&width=1440&height=391')
            .setTimestamp()
            .setFooter({
                text: 'Helpcord | Multipurpose bot for Discord',
                iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
            });

    await dm.send({
        embeds: [embed],
        components: [row]
    });
    } catch (error) {
        console.error(error);
    }

}
