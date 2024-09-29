const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await db.query('SELECT status FROM users WHERE id = ?', [user.userId]);

        if (rows.length === 0 || rows[0].status === 'blocked') {
            return res.status(403).json({ message: 'Forbidden: User is blocked' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Invalid token error:', err);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
};

module.exports = { authenticateToken };
