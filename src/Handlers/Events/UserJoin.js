import {AddUser} from "../Database/Users.js";
import {checkWelcome, getWelcome} from "../Database/Welcome.js";
import {welcomeCard, welcomeCardImage} from "../Welcome/welcomeCard.js";

export const UserJoin = async (member) => {

    if (await checkWelcome(member.guild.id)) {
        const welcomeInfo = await getWelcome(member.guild.id);

        const welcomeMessage = welcomeInfo.welcome_message
            .replace(/\$count/g, member.guild.memberCount)
            .replace(/\$user/g, member.user.username)
            .replace(/\$server/g, member.guild.name);

        const welcomeChannel = welcomeInfo.welcome_channel_id;
        const welcomeImage = welcomeInfo.welcome_image;

        if (!welcomeImage) {
            await welcomeCard(member, welcomeInfo);
        } else {
            await welcomeCardImage(member, welcomeInfo);
        }

    }

    await AddUser(member);
}