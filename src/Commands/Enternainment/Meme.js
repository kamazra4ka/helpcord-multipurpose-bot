import {getEmbed, getFooterDetails} from "../../Barrels/BarrelHandlers.js";
import {getMessages} from "../../Handlers/Database/Messages.js";
import {memeGenerator} from "../../Handlers/Entertainment/Meme/memeGenerator.js";
import {EmbedBuilder} from "discord.js";

export const Meme = async (interaction) => {

    const footer = await getFooterDetails(interaction);

    let memeTemplates = [
        'https://api.memegen.link/images/pigeon/',
        'https://api.memegen.link/images/astronaut/',
        'https://api.memegen.link/images/captain-america/',
        'https://api.memegen.link/images/ch/',
        'https://api.memegen.link/images/dbg/'
    ]

    let memeElements = [
        "https://thumbs.dreamstime.com/b/realistic-pizza-png-psd-natural-man-made-elements-realistic-oil-painting-yanjun-cheng-style-john-wilhelm-291385104.jpg",
        "https://i.redd.it/6dgfiozpbsv81.jpg",
        "https://i.pinimg.com/originals/d2/d2/bd/d2d2bdb3622d142948b44eecc2945e09.jpg",
        "https://m.media-amazon.com/images/I/31oAniReIAL._AC_SY145_.jpg",
    ]

    const avatarUrl = interaction.user.displayAvatarURL({format: 'png'});
    const nickname = interaction.user.username;

    const memeTemplate = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
    const memeIndex = memeTemplates.indexOf(memeTemplate);

    console.log(memeIndex)
    console.log(memeIndex)
    console.log(memeIndex)
    console.log(memeIndex)
    console.log(memeIndex)


    const memeElement = memeElements[Math.floor(Math.random() * memeElements.length)];
    const memeText = await getMessages(interaction.guildId);
    const memeImage = await memeGenerator(memeText, memeTemplate, avatarUrl, nickname, memeElement, memeIndex, interaction.channel);

    interaction.reply({
        content: 'Your meme is being generated. Please wait.',
        ephemeral: true
    });

    setTimeout(() => {
        interaction.deleteReply();
    }, 2000);

    setTimeout(async () => {
        const embed = new EmbedBuilder()
            .setColor(await getEmbed(interaction.guildId))
            .setImage(memeImage)
            .setTitle(`Requested by ${interaction.user.username}`)
            .setTimestamp()
            .setFooter({
                text: `${footer.footerText}`,
                iconURL: `${footer.footerIcon}`
            });

        if (!memeImage) {
            embed.setDescription('Sorry, I was unable to generate a meme. Please try again later.');
        }

        await interaction.channel.send({embeds: [embed]})
    }, 2000);
}