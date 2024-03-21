import {getFooterDetails} from "../../Barrels/BarrelHandlers.js";
import {getMessages} from "../../Handlers/Database/Messages.js";
import {memeGenerator} from "../../Handlers/Entertainment/Meme/memeGenerator.js";

export const Meme = async (interaction) => {

    const footer = await getFooterDetails(interaction);

    let memeTemplates = [
        'https://api.memegen.link/images/pigeon/'
    ]

    const avatarUrl = interaction.user.displayAvatarURL({format: 'png'});
    const nickname = interaction.user.username;

    const memeTemplate = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
    const memeText = await getMessages(interaction.guildId);
    const memeImage = await memeGenerator(memeText, memeTemplate, avatarUrl, nickname);

    interaction.reply({
        content: memeImage
    });

}