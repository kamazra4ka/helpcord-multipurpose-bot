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
        description: 'LockTextChannel the channel for everyone.',
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
        description: 'UnlockTextChannel the channel for everyone.',
        options: [
            {
                name: 'channel',
                description: 'The channel to unlock',
                type: 7,
                required: true,
            }
        ],
    },
    {
        name: 'slowmode',
        description: 'Set a precise slowmode for the channel.',
        options: [
            {
                name: 'channel',
                description: 'The channel to set slowmode for',
                type: 7,
                required: true,
            },
            {
                name: 'time',
                description: 'The time in seconds for slowmode',
                type: 4,
                required: true,
            }
        ],
    },
    {
        name: 'voicesetup',
        description: 'Setup temp voices system for your server.',
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