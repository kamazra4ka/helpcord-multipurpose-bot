import {AttachmentBuilder} from "discord.js";
import Canvas from '@napi-rs/canvas';

export const welcomeCard = async (member, welcomeInfo, serverColor) => {
    const welcomeMessage = welcomeInfo.welcome_message
        .replace(/\$count/g, member.guild.memberCount)
        .replace(/\$user/g, member.user.username)
        .replace(/\$server/g, member.guild.name);

    const welcomeChannel = member.guild.channels.cache.get(welcomeInfo.welcome_channel_id);

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://media.discordapp.net/attachments/1212377559669669930/1215217644148367400/bg.png?ex=65fbf2a0&is=65e97da0&hm=e77a2417ee473b30108e2b31802a90554ed926ce1cb3ee970be2e90af9d2526f&=&format=webp&quality=lossless&width=1921&height=521');

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = serverColor;

    context.strokeRect(0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(member.displayAvatarURL({ extension: 'jpg' }));

    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });

    try {
        welcomeChannel.send({ files: [attachment] });
    } catch (e) {
        console.log(e)
    }

}