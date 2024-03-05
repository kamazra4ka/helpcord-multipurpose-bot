import {showModalTempVoices} from "../../Handlers/TempVoices/showModalTempVoices.js";

export const SetupTempVoices = async (interaction) => {
    await showModalTempVoices(interaction);
}