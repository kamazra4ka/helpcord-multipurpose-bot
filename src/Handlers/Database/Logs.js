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

export const writeLog = async (userId, serverId, action) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT logs SET logs_user_id = ?, logs_server_id = ?, logs_action = ?, logs_timestamp = ?', [userId, serverId, action, timestamp], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });

}