import mysql from 'mysql2';
import { config } from 'dotenv';
config();
//const mysqlPassword = process.env.MYSQL_PASSWORD;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'helpcord',
    waitForConnections: true,
    connectionLimit: 10000,
    queueLimit: 0,
});

export const addAllMembers = async (guild) => {

        const members = guild.members.cache;
        const serverDiscordId = guild.id;

        members.forEach(member => {
            const userId = member.user.id;
            const joinedAt = member.joinedAt;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error(err);
                    return;
                }

                connection.query('INSERT users SET user_discord_id = ?, user_server_id = ?, user_joined_at = ?', [userId, serverDiscordId, joinedAt], async (err, rows) => {
                    connection.release();
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            });
        });
}

export const AddUser = async (member) => {
    const userId = member.user.id;
    const serverDiscordId = member.guild.id;
    const joinedAt = member.joinedAt;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT users SET user_discord_id = ?, user_server_id = ?, user_joined_at = ?', [userId, serverDiscordId, joinedAt], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}

export const RemoveUser = async (member) => {
    const userId = member.user.id;
    const serverDiscordId = member.guild.id;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('DELETE FROM users WHERE user_discord_id = ? AND user_server_id = ?', [userId, serverDiscordId], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}