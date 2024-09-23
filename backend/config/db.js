const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'macarony',
    database: process.env.DB_NAME || 'mysql',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Количество соединений в пуле
    queueLimit: 0, // Без ограничения очереди запросов
});

module.exports = pool;
