import {getBranding} from "./Database/Customization.js";

export const getFooterDetails = async (interaction) => {
    let footerText, footerIcon;
    if (await getBranding(interaction.guildId)) {
        footerText = 'Helpcord | Multipurpose bot for Discord';
        footerIcon = 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487';
    } else {
        try {
            footerText = interaction.guild.name;
            footerIcon = interaction.guild.iconURL();
        } catch (e) {
            console.log(e)
            footerText = 'Helpcord | Multipurpose bot for Discord';
            footerIcon = 'https://media.discordapp.net/attachments/1212377559669669930/1213033923853029396/7206b41c-5f05-47dc-87cd-d6433649b201.png?ex=65f400e0&is=65e18be0&hm=330ee0af24766736475e0627ab2c87cbfa42055ff2b25bde191a21269a349930&=&format=webp&quality=lossless&width=487&height=487';
        }
    }

    return {footerText, footerIcon};
}