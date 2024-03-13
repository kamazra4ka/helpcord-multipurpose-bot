import {EmbedBuilder} from "discord.js";
import {getEmbed} from "../../../Handlers/Database/Customization.js";
import {getFooterDetails, getUserPunishments, isLoungeBanned} from "../../../Barrels/BarrelHandlers.js";

export const UserPunishments = async (interaction) => {

    const footer = await getFooterDetails(interaction);

    const user = interaction.options.getUser('user');
    if (!user) return interaction.reply({content: 'Please provide a user to continue.', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);

    const isLBanned = await isLoungeBanned(user.id, interaction.guildId);
    const isServerBanned = await interaction.guild.bans.fetch(user.id).catch(() => null);
    const userPunishments = await getUserPunishments(user.id, interaction.guildId);
    const amountOfPunishments = userPunishments.length;

    if (userPunishments.length === 0) {
        return interaction.reply({content: 'This user has no punishments on this server.', ephemeral: true});
    }

    // find in userPunishments
    // example
    // {
    //     punishment_internal_id: 9,
    //     punishment_user_id: '1175135319390179350',
    //     punishment_moderator_id: '669462196589166623',
    //     punishment_server_id: '1212377559023489024',
    //     punishment_type: 'SERVER_MUTE',
    //     punishment_reason: 'test #3',
    //     punishment_start: 1710097850647,
    //     punishment_end: 1710097910647,
    //     punishment_active: 0
    //   },
    //   {
    //     punishment_internal_id: 10,
    //     punishment_user_id: '1175135319390179350',
    //     punishment_moderator_id: '669462196589166623',
    //     punishment_server_id: '1212377559023489024',
    //     punishment_type: 'SERVER_KICK',
    //     punishment_reason: 'test #4',
    //     punishment_start: 1710242009464,
    //     punishment_end: 1710242009465,
    //     punishment_active: 0
    //   },
    //   {
    //     punishment_internal_id: 11,
    //     punishment_user_id: '1175135319390179350',
    //     punishment_moderator_id: '669462196589166623',
    //     punishment_server_id: '1212377559023489024',
    //     punishment_type: 'SERVER_MUTE',
    //     punishment_reason: 'test #5',
    //     punishment_start: 1710242692665,
    //     punishment_end: 1710243292665,
    //     punishment_active: 0
    //   }
    // ]
    const userServerBans = userPunishments.filter(punishment => punishment.punishment_type === 'SERVER_BAN');
    const userServerMutes = userPunishments.filter(punishment => punishment.punishment_type === 'SERVER_MUTE');
    const userServerKicks = userPunishments.filter(punishment => punishment.punishment_type === 'SERVER_KICK');

    const lastServerBan = userServerBans.length > 0 ? userServerBans[userServerBans.length - 1] : null;
    const lastServerMute = userServerMutes.length > 0 ? userServerMutes[userServerMutes.length - 1] : null;
    const lastServerKick = userServerKicks.length > 0 ? userServerKicks[userServerKicks.length - 1] : null;

    const joinedAt = member.joinedAt;

    const lastPunishments = [];

    // userpunishments
    for (let i = 0; i < userPunishments.length; i++) {
        const punishment = userPunishments[i];
        const punishmentType = punishment.punishment_type;
        const punishmentReason = punishment.punishment_reason;
        const punishmentActive = punishment.punishment_active;

        let startDate = punishment.punishment_start / 1000;
        startDate = startDate.toString().split('.')[0];
        const punishmentStart = `<t:${startDate}:F>`

        let endDate = punishment.punishment_end / 1000;
        endDate = endDate.toString().split('.')[0];
        const punishmentEnd = `<t:${endDate}:F>`;

        lastPunishments.push({
            type: punishmentType,
            reason: punishmentReason,
            start: punishmentStart,
            end: punishmentEnd,
            active: punishmentActive
        });
    }

    if (lastPunishments.length > 3) {
        lastPunishments.length = 3;
    }

    const lastPunishmentsString = lastPunishments.map(punishment => `**Type:** ${punishment.type}\n**Reason:** ${punishment.reason}\n**Start:** ${punishment.start}\n**End:** :${punishment.end}\n**Active:** ${punishment.active ? 'Yes' : 'No'}`).join('\n\n');

    // debug values for now
    const botLevel = 4;

    const responseEmbed = new EmbedBuilder()
        .setColor(await getEmbed(interaction.guildId))
        .setTitle('Helpcord | Punishments')
        .setDescription(`**👤 User:** <@${user.id}>\n**🕰️ Joined server:** ${joinedAt}\n**✨ In-bot level:** ${botLevel}\n\n${lastPunishmentsString}`)
        .addFields(
            {
                name: '🔨 Banned',
                value: isServerBanned ? '✅ Yes' : '❌ No',
                inline: true
            },
            {
                name: '🔇 Lounge Banned',
                value: isLBanned ? '✅ Yes' : '❌ No',
                inline: true
            },
            {
                name: '💥 Received punishments',
                value: `🚩 ${amountOfPunishments.toString()}`,
                inline: true
            }
        )
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1215601475967909958/punishments.png?ex=65fd5818&is=65eae318&hm=847c733801a0a0e8d7364481cf78e1b178853b3adf3fb75200512e29a98a55f3&=&format=webp&quality=lossless&width=1057&height=287')
        .setTimestamp()
        .setFooter({
            text: `${footer.footerText}`,
            iconURL: `${footer.footerIcon}`
        });

    await interaction.reply({
        content: '',
        embeds: [responseEmbed]
    });

}