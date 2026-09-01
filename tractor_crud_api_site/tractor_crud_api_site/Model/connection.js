const mysql = require('mysql2/promise');

let connection = null;

async function query(sql, params) {
    await setDatabaseConnction();
    const [results,] = await connection.execute(sql, params);
    return results;
}

async function getLastInsertId(sql, params) {
    await setDatabaseConnction();
    const result = await connection.query(sql, params);
    return result[0].insertId;
}

async function setDatabaseConnction() {
    //Singleton DB connection
    if (null === connection) {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: ''
        });
    }
}

module.exports = {
    query,
    getLastInsertId
}
