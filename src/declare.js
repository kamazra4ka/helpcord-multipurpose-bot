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
        name: 'loungesetup',
        description: 'Setup temp voices system for your server.',
    },
    {
        name: 'setcolor',
        description: 'Set the HEX color of the embeds for the bot on this server.',
        options: [
            {
                name: 'color',
                description: 'The color to set in HEX format (#000000)',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'branding',
        description: 'Enable your server\'s branding of the bot on this server.',
        // choice between "server" and "bot"
        options: [
            {
                name: 'type',
                description: 'The type of branding',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'Server',
                        value: 'server'
                    },
                    {
                        name: 'Bot',
                        value: 'bot'
                    }
                ]
            }
        ]
    },
    {
        name: 'welcome',
        description: 'Create a welcome (greetings) channel for your server.',
    },
    {
        name: 'banlounges',
        description: 'Ban a user from creating new lounges.',
        options: [
            {
                name: 'user',
                description: 'The user to ban',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the ban',
                type: 3,
                required: true
            },
            {
                name: 'duration',
                description: 'The duration of the ban (1m = 1 minute, 1h = 1 hour, 1d = 1 day, etc)',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'ban',
        description: 'Ban a user from this server.',
        options: [
            {
                name: 'user',
                description: 'The user to ban',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the ban',
                type: 3,
                required: true
            },
            {
                name: 'duration',
                description: 'The duration of the ban (1m = 1 minute, 1h = 1 hour, 1d = 1 day, etc)',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'mute',
        description: 'Mute a user on this server.',
        options: [
            {
                name: 'user',
                description: 'The user to mute',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the mute',
                type: 3,
                required: true
            },
            {
                name: 'duration',
                description: 'The duration of the mute (1m = 1 minute, 1h = 1 hour, 1d = 1 day, etc)',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'unmute',
        description: 'Unmute a user on this server.',
        options: [
            {
                name: 'user',
                description: 'The user to unmute',
                type: 6,
                required: true
            }
        ]
    },
    {
        name: 'kick',
        description: 'Kick a user from this server.',
        options: [
            {
                name: 'user',
                description: 'The user to kick',
                type: 6,
                required: true
            },
            {
                name: 'reason',
                description: 'The reason for the kick',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'punishments',
        description: 'Get a list of all punishments for the user.',
        options: [
            {
                name: 'user',
                description: 'The user to get punishments for',
                type: 6,
                required: true
            }
        ]
    },
    {
        name: "roast",
        description: "Roast a user's profile.",
        options: [
            {
                name: 'user',
                description: 'The user to roast',
                type: 6,
                required: true
            }
        ]
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