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

                console.log(rows);

                if (rows.length === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    });
}

export const getWelcome = async (serverId) => {
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

                console.log(rows);

                if (rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(false);
                }
            });
        });
    });
}

export const addWelcomeChannel = async (serverId, channelId, message, channelImage) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT welcome SET welcome_server_id = ?, welcome_channel_id = ?, welcome_message = ?, welcome_image = ?', [serverId, channelId, message, channelImage], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}

export const getWelcomeChannel = async (serverId) => {
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

                resolve(rows[0]);
            });
        });
    });
}

export const editWelcome = async (serverId, field, message) => {

    if (field === "message") {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                return;
            }

            connection.query('UPDATE welcome SET welcome_message = ? WHERE welcome_server_id = ?', [message, serverId], async (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    } else {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                return;
            }

            connection.query('UPDATE welcome SET welcome_image = ? WHERE welcome_server_id = ?', [message, serverId], async (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });

    }


}

export const deleteWelcomeChannel = async (serverId) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('DELETE FROM welcome WHERE welcome_server_id = ?', [serverId], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}