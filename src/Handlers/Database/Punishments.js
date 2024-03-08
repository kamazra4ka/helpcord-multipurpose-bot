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

export const writePunishment = async (userId, moderatorId, serverId, punishmentType, punishmentReason, punishmentEnd) => {

    const punishmentStart = new Date().getTime();
    punishmentEnd = punishmentStart + punishmentEnd;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT punishments SET punishment_user_id = ?, punishment_moderator_id = ?, punishment_server_id = ?, punishment_type = ?, punishment_reason = ?, punishment_start = ?, punishment_end = ?', [userId, moderatorId, serverId, punishmentType, punishmentReason, punishmentStart, punishmentEnd], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });

}

export const getUserPunishments = (userId, serverId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            connection.query('SELECT * FROM punishments WHERE punishment_user_id = ? AND punishment_server_id = ?', [userId, serverId], (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                console.log(rows);
                resolve(rows);
            });
        });
    });
}


export const checkPunishments = () => {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            connection.query('SELECT * FROM punishments WHERE punishment_end <= ? AND punishment_active = 1', [timestamp], (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                resolve(rows);
            });
        });
    });
}


export const isLoungeBanned = (userId, serverId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            connection.query('SELECT * FROM punishments WHERE punishment_user_id = ? AND punishment_server_id = ? AND punishment_type = ? AND punishment_active = 1', [userId, serverId, 'LOUNGES_BAN'], (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                resolve(!!rows.length);
            });
        });
    });
}

export const endPunishment = (punishmentId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            connection.query('UPDATE punishments SET punishment_active = 0 WHERE punishment_internal_id = ?', [punishmentId], (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                resolve(rows);
            });
        });
    });
}