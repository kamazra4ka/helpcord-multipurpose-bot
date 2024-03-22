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
            return `${memeTemplate}${nickname}/_/${memeText}.png?style=${memeElement}`;
        case 1:
            memeText = await splitText(memeText, nickname)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");
            memeText = memeText.split('%%%')
            return `${memeTemplate}${memeText[0]}/${memeText[1]}/${memeText[2]}/${nickname}.png?style=${memeElement}?maxwidth=760&fidelity=grand`
        case 2:
            // https://api.memegen.link/images/captain-america/Have_you_ever_eaten_a_clock~q/No,_why~q/It's_time_consuming..png
            memeText = await splitText(memeText, nickname)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");
            memeText = memeText.split('%%%')

            return `${memeTemplate}${memeText[0]}/${memeText[1]}/${memeText[2]}?maxwidth=760&fidelity=grand`
        case 3:
            memeText = await enhanceText(memeText)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");

            memeText = memeText.replace(/"/g, "_");
            memeText = memeText.replace(/'/g, "_");

            console.log(memeText)
            return `${memeTemplate}${nickname}/${memeText}.png`;
        case 4:
            memeText = await enhanceText(memeText)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");

            memeText = memeText.replace(/"/g, "_");
            memeText = memeText.replace(/'/g, "_");

            return `${memeTemplate}${memeText}/${nickname}_exists.png`;
        case 5:
            memeText = await enhanceText(memeText)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");

            memeText = memeText.replace(/"/g, "_");
            memeText = memeText.replace(/'/g, "_");

            return `${memeTemplate}${nickname}_died_in_a_car_accident/${memeText}.png`;
        case 6:
            // https://api.memegen.link/images/drowning/Me_Asking_for_Help/Online_Commenter/I'm_having_that_problem_too..png
            memeText = await enhanceText(memeText)
            memeText = memeText.replace(/ /g, "_");
            nickname = nickname.replace(/ /g, "_");

            memeText = memeText.replace(/"/g, "_");
            memeText = memeText.replace(/'/g, "_");

            return `${memeTemplate}Me_Asking_for_Help/${nickname}/${memeText}?maxwidth=760&fidelity=grand`
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
                        text: `Hi there! Answer in English! Your task is to remove all the nonsense from the meme text and try to make it a bit funnier. Keep your response short (one sentence). REPLY ONLY WITH MEME TEXT, NO BRACKETS. DON'T CHANGE CONTEXT TOO MUCH. YOU HAVE TO GENERATE SOMETHING EVERYTIME. YOU DON'T HAVE TO ACCESS ANY LINKS OR EXTERNAL IMAGES. Please no "when|when" memes, they are outdated. YOUR TASK IS TO JUST MAKE TEXT.\n\nMeme text: ${memeText}`
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
                        text: `Hi there! Answer in English! Your task is to remove all the nonsense from the meme text and try to make it a bit funnier and then split it into slides in format: FIRSTMEMETEXT%%%SECONDMEMETEXT%%%FIRSTMEMECHARACTER%%%SECONDMEMECHARACTER. Make a story for your meme and display it in 3 slides (you can use FIRSTMEMECHARACTER for very short text or items). Please no "when|when" memes, they are outdated. Keep your meme text short (one sentence) and meme part VERY SHORT, 4-5 WORDS AT MAXIMUM. YOU HAVE TO SPLIT THE TEXT WITH %%% LIKE IN THE FORMAT STRING. REPLY ONLY WITH MEME TEXT. YOU DON'T HAVE TO ACCESS ANY LINKS OR EXTERNAL IMAGES. YOUR TASK IS TO JUST MAKE TEXT. DON'T CHANGE CONTEXT TOO MUCH. YOU HAVE TO GENERATE SOMETHING EVERYTIME"\n\nMeme text: ${memeText}`
                    }
                ],
            },
        ],
    });

    return response.choices[0].message.content;
}