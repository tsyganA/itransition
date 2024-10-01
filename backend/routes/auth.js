const express = require('express');
const router = express.Router();
const admin = require('../firebase'); // Подключаем инициализированный Firebase Admin

// Эндпоинт для создания пользователя
router.post('/createUser', async (req, res) => {
    const { email, password, displayName } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
        });

        res.status(201).json({ message: 'User created successfully', user: userRecord });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
