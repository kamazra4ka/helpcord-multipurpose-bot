import OpenAI from "openai";

const openai = new OpenAI();

export const Roast = async (interaction) => {

    const user = interaction.options.getUser('user');

    const roastUsername = user.username;
    const roastDisplayName = user.displayName;
    const roastAvatarURL = user.avatarURL();

    await interaction.reply({content: 'Your roast is being generated. Please wait.', ephemeral: true}).then(() => {
        setTimeout(() => {
            interaction.deleteReply();
        }, 2000);
    }).catch((error) => {
        console.error(error);
    })

    const roastResult = await getRoast(roastUsername, roastDisplayName, interaction.guild.name, roastAvatarURL);

    if (roastResult.includes('Sorry')) {
        const roastResult = await getRoast(roastUsername, roastDisplayName, interaction.guild.name, roastAvatarURL);
        interaction.channel.send({content: `**<@${interaction.user.id}>**\n\n${roastResult}`})
    } else {
        interaction.channel.send({content: `**<@${interaction.user.id}>**\n\n${roastResult}`})
    }

}

const getRoast = async (username, name, serverName, URL) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Hi there! Your task is to point out the flows in the nickname ${username} and ${name} and my avatar. Use the Gen Z style of "roasting" things. Keep your response short (two sentences).`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            "url": `${URL}`,
                            detail: "low"
                        },
                    },
                ],
            },
        ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;

}