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

export const getEmbed = async (serverId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            connection.query('SELECT * FROM settings WHERE settings_server_id = ?', [serverId], (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    reject(err);
                }

                if (rows[0].length !== 0) {
                    if (rows[0] === null) {
                        resolve('#041c3c');
                    } else {

                        // get settings_embed and check if it's actually hex
                        const color = rows[0].settings_embed;
                        if (color.match(/^#[0-9A-F]{6}$/i)) {
                            resolve(color);
                        } else {
                            resolve('#041c3c');
                        }
                    }
                }
            });
        });
    });
}