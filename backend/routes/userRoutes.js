// userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const { auth } = require('../firebaseAdmin'); // Подключаем auth из Firebase Admin SDK
const { getDatabase, ref, remove } = require('firebase-admin/database'); // Подключаем Realtime Database
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

// Удаление пользователя из Firebase Authentication и Realtime Database
router.delete('/users/delete', async (req, res) => {
    const { userId } = req.body;

    if (!userId || !Array.isArray(userId)) {
        return res.status(400).send('Invalid user data.');
    }

    const db = getDatabase();

    try {
        // Одновременное удаление пользователей из Authentication и Realtime Database
        await Promise.all(
            userId.map(async id => {
                // Удаление пользователя из Firebase Authentication
                await auth.deleteUser(id);
                console.log(`Successfully deleted user from Firebase Auth: ${id}`);

                // Удаление пользователя из Realtime Database
                const userRef = ref(db, `users/${id}`);
                await remove(userRef);
                console.log(`Successfully deleted user from Realtime Database: ${id}`);
            })
        );

        res.status(200).send('User(s) deleted successfully from both Firebase Authentication and Realtime Database.');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Failed to delete user.');
    }
});

// Блокировка пользователя
router.post('/users/block', async (req, res) => {
    const { userId } = req.body;

    if (!userId || !Array.isArray(userId)) {
        return res.status(400).send('Invalid user data.');
    }

    try {
        for (const id of userId) {
            await auth.updateUser(id, { disabled: true });
            console.log(`Successfully blocked user: ${id}`);
        }
        res.status(200).send('User(s) blocked successfully.');
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send('Failed to block user.');
    }
});

// Разблокировка пользователя
router.post('/users/unblock', async (req, res) => {
    const { userId } = req.body;

    if (!userId || !Array.isArray(userId)) {
        return res.status(400).send('Invalid user data.');
    }

    try {
        for (const id of userId) {
            await auth.updateUser(id, { disabled: false });
            console.log(`Successfully unblocked user: ${id}`);
        }
        res.status(200).send('User(s) unblocked successfully.');
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).send('Failed to unblock user.');
    }
});

module.exports = router;
