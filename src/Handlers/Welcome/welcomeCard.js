import {AttachmentBuilder} from "discord.js";
import Canvas from '@napi-rs/canvas';

export const welcomeCard = async (member, welcomeInfo) => {
    const welcomeMessage = welcomeInfo.welcome_message
        .replace(/\$count/g, member.guild.memberCount)
        .replace(/\$user/g, member.user.username)
        .replace(/\$server/g, member.guild.name);

    const welcomeChannel = member.guild.channels.cache.get(welcomeInfo.welcome_channel_id);

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://i.imgur.com/2J3Iy3j.png');

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set the color of the stroke
    context.strokeStyle = '#0099ff';

    // Draw a rectangle with the dimensions of the entire canvas
    context.strokeRect(0, 0, canvas.width, canvas.height);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });

    try {
        welcomeChannel.send({ files: [attachment] });
    } catch (e) {
        console.log(e)
    }

}