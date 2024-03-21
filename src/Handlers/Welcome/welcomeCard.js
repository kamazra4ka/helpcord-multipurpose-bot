import { AttachmentBuilder } from "discord.js";
import Canvas from '@napi-rs/canvas';

const drawRoundedRect = (context, x, y, width, height, radius) => {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
};

const applyText = (canvas, text) => {
    const context = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        context.font = `${fontSize -= 10}px gg sans Medium`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};

export const welcomeCard = async (member, welcomeInfo, serverColor, welcomeMessage) => {
    try {
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://media.discordapp.net/attachments/1212377559669669930/1220446714402574426/bg.png?ex=660ef893&is=65fc8393&hm=f58588f743fa713d5ea2dec3606c480df2c7e74e80cf8d355a96d06c8959386f&=&format=webp&quality=lossless&width=687&height=186');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw stroke around the canvas
    context.strokeStyle = serverColor;
    context.lineWidth = 10; // Set the line width for the stroke
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Load the avatar image
    const avatar = await Canvas.loadImage(member.displayAvatarURL({ extension: 'jpg' }));

    const avatarX = 25, avatarY = 25, avatarWidth = 200, avatarHeight = 200, borderRadius = 20;
    drawRoundedRect(context, avatarX, avatarY, avatarWidth, avatarHeight, borderRadius);
    context.save();
    context.clip();

    context.drawImage(avatar, avatarX, avatarY, avatarWidth, avatarHeight);

    context.restore(); // If you've previously called context.save() to save the canvas state
    context.save(); // Save the canvas state if further clipping operations are expected

    await drawRoundedRect(context, avatarX, avatarY, avatarWidth, avatarHeight, borderRadius);
    context.strokeStyle = serverColor;
    context.lineWidth = 5;
    context.stroke();

    context.font = '48px ROG Fonts';
    context.fillStyle = '#ffffff';
    context.fillText('Welcome!', canvas.width / 2.5, canvas.height / 1.8);

  //  context.font = applyText(canvas, member.displayName);
  //  context.fillStyle = '#ffffff';
  //  context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.6);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });

    const welcomeChannel = member.guild.channels.cache.get(welcomeInfo.welcome_channel_id);
    try {
        await welcomeChannel.send({
            content: welcomeMessage,
            files: [attachment]
        });
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
}

export const welcomeCardImage = async (member, welcomeInfo, serverColor, welcomeMessage) => {
    try {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(welcomeInfo.welcome_image);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw stroke around the canvas
        context.strokeStyle = serverColor;
        context.lineWidth = 10; // Set the line width for the stroke
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Load the avatar image
        const avatar = await Canvas.loadImage(member.displayAvatarURL({ extension: 'jpg' }));

        const avatarX = 25, avatarY = 25, avatarWidth = 200, avatarHeight = 200, borderRadius = 20;
        drawRoundedRect(context, avatarX, avatarY, avatarWidth, avatarHeight, borderRadius);
        context.save();
        context.clip();

        context.drawImage(avatar, avatarX, avatarY, avatarWidth, avatarHeight);

        context.restore(); // If you've previously called context.save() to save the canvas state
        context.save(); // Save the canvas state if further clipping operations are expected

        await drawRoundedRect(context, avatarX, avatarY, avatarWidth, avatarHeight, borderRadius);
        context.strokeStyle = serverColor;
        context.lineWidth = 5;
        context.stroke();

        context.font = '48px ROG Fonts';
        context.fillStyle = '#ffffff';
        context.fillText('Welcome!', canvas.width / 2.5, canvas.height / 1.8);

        //  context.font = applyText(canvas, member.displayName);
        //  context.fillStyle = '#ffffff';
        //  context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.6);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });

        const welcomeChannel = member.guild.channels.cache.get(welcomeInfo.welcome_channel_id);
        try {
            await welcomeChannel.send({
                content: welcomeMessage,
                files: [attachment]
            });
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e);
    }
}
