import {AddUser} from "../Database/Users.js";
import {checkWelcome, getWelcome} from "../Database/Welcome.js";
import {welcomeCard} from "../Welcome/welcomeCard.js";
import {getEmbed} from "../Database/Customization.js";

export const UserJoin = async (member) => {

    if (await checkWelcome(member.guild.id)) {
        const welcomeInfo = await getWelcome(member.guild.id);

        const welcomeMessage = welcomeInfo.welcome_message
            .replace(/\$count/g, member.guild.memberCount)
            .replace(/\$user/g, member.user.username)
            .replace(/\$server/g, member.guild.name);

        const welcomeChannel = welcomeInfo.welcome_channel_id;
        const welcomeImage = welcomeInfo.welcome_image;
        const serverColor = await getEmbed(member.guild.id);

        if (!welcomeImage) {
            await welcomeCard(member, welcomeInfo, serverColor, welcomeMessage);
        } else {
            await welcomeCardImage(member, welcomeInfo, serverColor, welcomeMessage);
        }

    }

    await AddUser(member);
}