import {AddUser} from "../Database/Users.js";

export const UserJoin = async (member) => {
    await AddUser(member);
}