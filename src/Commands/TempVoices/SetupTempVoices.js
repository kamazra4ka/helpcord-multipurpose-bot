import {showModalTempVoices} from "../../Handlers/TempVoices/Modals/showModalTempVoices.js";

export const SetupTempVoices = async (interaction) => {
    await showModalTempVoices(interaction);
}