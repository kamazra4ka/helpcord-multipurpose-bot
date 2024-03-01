import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
config();

const botToken = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
    {
        name: 'help',
        description: 'Get a quick overview of all bot\'s commands.',
    }
];

const rest = new REST({ version: '10' }).setToken(botToken);

try {
    console.log('Started refreshing application (/) Commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) Commands.');
} catch (error) {
    console.error(error);
}