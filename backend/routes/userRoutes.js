const express = require('express');
const { registerUser, loginUser, getUsers, updateUsersStatus, deleteUsers } = require('../controllers/userController'); // Добавьте deleteUsers
const { authenticateToken } = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Маршрут для регистрации
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        // Удаляем проверку длины пароля
        // check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    registerUser
);

// Маршрут для аутентификации
router.post(
    '/login',
    [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    loginUser
);

// Получение списка пользователей
router.get('/users', authenticateToken, getUsers);

// Обновление статуса пользователей
router.post('/users/update', authenticateToken, updateUsersStatus);

// Удаление пользователей
router.delete('/users/delete', authenticateToken, deleteUsers); // <-- Добавляем маршрут удаления пользователей

module.exports = router;
