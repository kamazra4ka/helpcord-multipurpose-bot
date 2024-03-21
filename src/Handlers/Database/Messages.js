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

export const writeMessage = async (context, serverId) => {
    let cycle = await getCycle(serverId);

    if (cycle) {
        cycle = cycle.message_cycle;
    }

    console.log(cycle)
    console.log(cycle)
    console.log(cycle)

    if (cycle === 50) {
        cycle = 1;
        await deleteMessage(2, serverId);
    }

    if (!cycle) {
        cycle = 0;
    }

    cycle++;
    await deleteMessage(cycle, serverId);

    console.log(cycle)

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('INSERT messages SET message_server_id = ?, message_content = ?, message_cycle = ?', [serverId, context, cycle], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}

const getCycle = async (serverId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            connection.query('SELECT message_cycle FROM messages WHERE message_server_id = ? ORDER BY message_id DESC LIMIT 1', [serverId], (err, rows) => {
                connection.release();
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                console.log(rows);
                resolve(rows[0]);
            });
        });
    });
}

const deleteMessage = async (cycle, serverId) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return;
        }

        connection.query('DELETE FROM messages WHERE message_cycle = ? AND message_server_id = ?', [cycle, serverId], async (err, rows) => {
            connection.release();
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}

export const getMessages = (serverId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            connection.query('SELECT * FROM messages WHERE message_server_id = ? ORDER BY message_id DESC', [serverId], (err, rows) => {
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