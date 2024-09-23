const db = require('../config/db');

// Функция для создания таблицы пользователей, если ее нет
const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            status ENUM('active', 'blocked') DEFAULT 'active'
        )
    `;
    return db.query(query);
};

module.exports = {
    createUserTable,
};
