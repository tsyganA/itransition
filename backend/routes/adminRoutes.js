// adminRoutes.js
const express = require('express');
const { listAllUsers } = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Маршрут для получения всех пользователей
router.get('/users', authenticateToken, listAllUsers);

module.exports = router;
