import {addWelcomeChannel} from "../Database/Welcome.js";

export const welcomeChannelModalHandler = async (interaction) => {
    // get info from modal fields
    const channelName = interaction.fields.getTextInputValue('channelName');
    const channelMessage = interaction.fields.getTextInputValue('channelMessage');

    const channel = await interaction.guild.channels.create(channelName, {
        type: 'GUILD_TEXT',
        topic: 'Greetings channel',
    });

    await addWelcomeChannel(interaction.guildId, channel.id, channelMessage);
}