// userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Маршрут для регистрации
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
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

module.exports = router;
