const db = require('../config/db');

const createUserTable = () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('active', 'blocked') DEFAULT 'active'
    )`;
    db.query(query, err => {
        if (err) throw err;
        console.log('User table created');
    });
};

module.exports = { createUserTable };
