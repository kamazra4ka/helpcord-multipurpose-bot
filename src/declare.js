import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
config();

const botToken = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
    {
        name: 'help',
        description: 'Get a quick overview of all bot\'s commands.',
    },
    {
        name: 'lock',
        description: 'Lock the channel for everyone.',
        options: [
            {
                name: 'channel',
                description: 'The channel to lock',
                type: 7,
                required: true,
            }
        ],
    },
    {
        name: 'unlock',
        description: 'Unlock the channel for everyone.',
        options: [
            {
                name: 'channel',
                description: 'The channel to unlock',
                type: 7,
                required: true,
            }
        ],
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