import {EmbedBuilder} from "discord.js";
import {getEmbed} from "../Database/Customization.js";


export const notifyUserModAction = async (guild, user, moderatorId, punishment, format) => {

    let conversation;

    try {
        conversation = await user.createDM();
    } catch (e) {
        console.log(user)
        console.log(e)
        return;
    }

    if (!conversation) return;

    const punishmentType = punishment.punishment_type;
    const punishmentReason = punishment.punishment_reason;
    let punishmentStartFormatted, punishmentEndFormatted;

    if (format) {
        punishmentStartFormatted = punishment.punishment_start
        punishmentEndFormatted = punishment.punishment_end
    } else {
        let startDate = punishment.punishment_start / 1000;
        startDate = startDate.toString().split('.')[0];
        punishmentStartFormatted = `<t:${startDate}:F>`

        let endDate = punishment.punishment_end / 1000;
        endDate = endDate.toString().split('.')[0];
        punishmentEndFormatted = `<t:${endDate}:F>`;
    }

    const serverId = guild.id;

    const notifyEmbed = new EmbedBuilder()
        .setColor('#041c3c')
        .setTitle('Helpcord | Punishments')
        .setDescription(`You received an update on your account status on **${guild.name}**. Here are the details:\n\n**Type:** ${punishmentType}\n**Reason:** ${punishmentReason}\n**Start:** ${punishmentStartFormatted}\n**End:** ${punishmentEndFormatted}`)
        .setImage('https://media.discordapp.net/attachments/1212377559669669930/1215601475967909958/punishments.png?ex=65fd5818&is=65eae318&hm=847c733801a0a0e8d7364481cf78e1b178853b3adf3fb75200512e29a98a55f3&=&format=webp&quality=lossless&width=1057&height=287')
        .setTimestamp()
        .setFooter({
            text: 'Helpcord | Multipurpose bot for Discord',
            iconURL: 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487'
        });

    await conversation.send({
        content: '',
        embeds: [notifyEmbed]
    });




}