import { EmbedBuilder } from "discord.js";
import {showModal} from "../../Handlers/TempVoices/showModalTempVoices.js";

export const SetupTempVoices = async (interaction) => {
    await showModal(interaction);
}