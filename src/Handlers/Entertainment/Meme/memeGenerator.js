import OpenAI from "openai";

const openai = new OpenAI();

export const memeGenerator = async (serverMessages, template, avatarUrl, nickname, memeElement, memeType, channel) => {

    let memeText = "";
    for (let i = 0; i < serverMessages.length; i++) {
        memeText += serverMessages[i].message_content + " ";
    }

    memeText = memeText.substring(Math.floor(Math.random() * memeText.length), Math.floor(Math.random() * memeText.length) + 200);


    memeText = memeText.replace(/ /g, "_");
    nickname = nickname.replace(/ /g, "_");

    return await GenerateImage(memeText, template, avatarUrl, nickname, memeElement, memeType, channel);
}

export const GenerateImage = async (memeText, memeTemplate, avatarUrl, nickname, memeElement, memeType, channel) => {

    switch (memeType) {
        case 0:
            memeText = await enhanceText(memeText)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");
            console.log(memeText)
            return `${memeTemplate}${nickname}/_/${memeText}~q.png?style=${memeElement}`;
        case 1:
            memeText = await splitText(memeText, nickname)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");
            memeText = memeText.split('%%%')
            return `${memeTemplate}${memeText[0]}~q/${memeText[1]}/${memeText[2]}/${nickname}.png?style=${memeElement}?maxwidth=760&fidelity=grand`
    }
}

const enhanceText = async (memeText) => {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Hi there! Your task is to remove all the nonsense from the meme text and try to make it a bit funnier. Keep your response short (one sentence). REPLY ONLY WITH MEME TEXT, NO BRACKETS. DON'T CHANGE CONTEXT TOO MUCH. YOU HAVE TO GENERATE SOMETHING EVERYTIME"\n\nMeme text: ${memeText}`
                    }
                ],
            },
        ],
    });

    console.log(response.choices[0].message.content)
    return response.choices[0].message.content;
}

const splitText = async (memeText, memeAuthor) => {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Hi there! Your task is to remove all the nonsense from the meme text and try to make it a bit funnier and then split it into categories in format: FIRSTMEMETEXT%%%SECONDMEMETEXT%%%FIRSTMEMECHARACTER%%%SECONDMEMECHARACTER. Keep your meme text short (one sentence). REPLY ONLY WITH MEME TEXT. DON'T CHANGE CONTEXT TOO MUCH. YOU HAVE TO GENERATE SOMETHING EVERYTIME"\n\nMeme text: ${memeText}\n\nMeme author nickname: ${memeAuthor}`
                    }
                ],
            },
        ],
    });

    return response.choices[0].message.content;
}