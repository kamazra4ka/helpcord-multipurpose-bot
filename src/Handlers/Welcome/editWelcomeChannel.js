import {deleteWelcomeChannel, getWelcome} from "../Database/Welcome.js";
import {EmbedBuilder} from "discord.js";
import {getEmbed} from "../Database/Customization.js";
import {getFooterDetails} from "../getFooterDetails.js";

export const editWelcomeChannel = async (interaction, editType) => {

    const currentWelcome = await getWelcome(interaction.guildId);
    const currentWelcomeChannel = interaction.guild.channels.cache.get(currentWelcome.welcome_channel_id);

    switch (editType) {
        case 'image':
            if (interaction.fields.getTextInputValue('channelImage')) {

            } else {

            }
            break;
        case 'message':
            await editWelcomeMessage(interaction);
            break;
        case 'delete':

            if (interaction.fields.getTextInputValue('confirmDelete') === 'DELETE') {

            const footer = await getFooterDetails(interaction);

            try {
                await currentWelcomeChannel.delete();
                try {
                    await deleteWelcomeChannel(interaction.guildId);
                } catch (e) {
                    await interaction.reply({
                        content: 'Something went wrong while trying to delete the welcome channel. Please try again.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor(await getEmbed(interaction.guildId))
                    .setTitle('Helpcord | Welcome Channel Deleted')
                    .setDescription(`**${interaction.user.username}**, you have successfully deleted the welcome channel.`)
                    .setImage('https://media.discordapp.net/attachments/1212377559669669930/1215255498903781376/welcome.png?ex=65fc15e1&is=65e9a0e1&hm=34bfb75d30c9d6d685b6751447e038efb04bcf78e28c8e9144cee404c1d51528&=&format=webp&quality=lossless&width=1921&height=521')
                    .setTimestamp()
                    .setFooter({
                        text: `${footer.footerText}`,
                        iconURL: `${footer.footerIcon}`
                    });

                await interaction.reply({
                    content: '',
                    embeds: [embed]
                });
            } catch (e) {
                console.log(e)
                await interaction.reply({
                    content: 'Something went wrong while trying to delete the welcome channel. Please try again.',
                    ephemeral: true
                });
            }

            } else {
                await interaction.reply({
                    content: 'You have failed to confirm the deletion. Please try again.',
                    ephemeral: true
                });
            }
            break;
        default:
            break;
    }
}