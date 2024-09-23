const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields (name, email, password)' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('INSERT INTO users (name, email, password, registration_date, status) VALUES (?, ?, ?, NOW(), "active")', [
            name,
            email,
            hashedPassword,
        ]);

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId, email });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Аутентификация пользователя
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (rows[0].status === 'blocked') {
            return res.status(403).json({ error: 'User is blocked' });
        }

        const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });
        await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [rows[0].id]);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Получение всех пользователей
const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const [currentUser] = await db.query('SELECT status FROM users WHERE id = ?', [currentUserId]);

        if (currentUser[0].status === 'blocked') {
            return res.status(403).json({ error: 'User is blocked' });
        }

        const [users] = await db.query('SELECT * FROM users');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Обновление статуса пользователей
const updateUsersStatus = async (req, res) => {
    const { userId, status } = req.body;

    if (!userId || !status) {
        return res.status(400).json({ error: 'Please provide both userId and status' });
    }

    if (!Array.isArray(userId)) {
        return res.status(400).json({ error: 'userId must be an array' });
    }

    try {
        const currentUserId = req.user.userId;
        const [currentUser] = await db.query('SELECT status FROM users WHERE id = ?', [currentUserId]);

        if (currentUser[0].status === 'blocked') {
            return res.status(403).json({ error: 'User is blocked' });
        }

        const [result] = await db.query('UPDATE users SET status = ? WHERE id IN (?)', [status, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Users not found' });
        }

        res.status(200).json({ message: 'User statuses updated successfully' });
    } catch (err) {
        console.error('Error updating user statuses:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Удаление пользователей
const deleteUsers = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Please provide userId' });
    }

    if (!Array.isArray(userId)) {
        return res.status(400).json({ error: 'userId must be an array' });
    }

    try {
        const currentUserId = req.user.userId;
        const [currentUser] = await db.query('SELECT status FROM users WHERE id = ?', [currentUserId]);

        if (currentUser[0].status === 'blocked') {
            return res.status(403).json({ error: 'User is blocked' });
        }

        const [result] = await db.query('DELETE FROM users WHERE id IN (?)', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Users not found' });
        }

        res.status(200).json({ message: 'Users deleted successfully' });
    } catch (err) {
        console.error('Error deleting users:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateUsersStatus,
    deleteUsers,
};
