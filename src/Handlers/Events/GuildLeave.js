import {removeGuild} from "../Database/Guilds.js";

export const GuildLeave = async (guild) => {
    await removeGuild(guild);
}