import OpenAI from "openai";

const openai = new OpenAI();

export const memeGenerator = async (serverMessages, template, avatarUrl, nickname) => {

    let memeText = "";
    for (let i = 0; i < serverMessages.length; i++) {
        memeText += serverMessages[i].message_content + " ";
    }

    if (memeText.length > 100) {
        memeText = memeText.substring(0, 100);
    }

    memeText = await enhanceText(memeText)

    memeText = memeText.replace(/ /g, "_");
    nickname = nickname.replace(/ /g, "_");

    return GenerateImage(memeText, template, avatarUrl, nickname);
}

export const GenerateImage = (memeText, memeTemplate, avatarUrl, nickname) => {
    return `${memeTemplate}${nickname}/_/${memeText}~q.png?style=${avatarUrl}`;
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
                        text: `Hi there! Your task is to remove all the nonsense from the meme text and try to make it a bit funnier. Keep your response short (one sentence). REPLY ONLY WITH MEME TEXT, NO BRACKETS.\n\nMeme text: ${memeText}`
                    }
                ],
            },
        ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
}