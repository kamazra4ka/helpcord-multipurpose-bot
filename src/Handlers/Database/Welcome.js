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

export const checkWelcome = async (serverId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                return;
            }

            connection.query('SELECT * FROM welcome WHERE welcome_server_id = ?', [serverId], async (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    return;
                }

                if (rows.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    });
}

export const addWelcomeChannel = async (serverId, channelId, message) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT welcome SET welcome_server_id = ?, welcome_channel_id = ?, welcome_message = ?', [serverId, channelId, message], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}