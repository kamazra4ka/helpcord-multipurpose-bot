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

export const newGuild = async (guild) => {

    const serverName = guild.name;
    const serverDiscordId = guild.id;
    const serverJoinDate = guild.joinedAt;

pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT servers SET server_name = ?, server_discord_id = ?, server_joindate = ?', [serverName, serverDiscordId, serverJoinDate], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}