const { auth, db: firestoreDb } = require('../config/firebaseConfig'); // Добавляем Firebase
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя с Firebase
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Проверка наличия необходимых полей
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields (name, email, password)' });
    }

    try {
        // Проверяем, существует ли пользователь в Firestore
        const userQuery = await firestoreDb.collection('users').where('email', '==', email).get();
        if (!userQuery.empty) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Создаем пользователя в Firebase Authentication
        const firebaseUser = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // Сохраняем пользователя в Firestore
        await firestoreDb.collection('users').doc(firebaseUser.uid).set({
            name,
            email,
            registration_date: new Date(),
            last_login: null,
            status: 'active',
        });

        res.status(201).json({ message: 'User registered successfully', userId: firebaseUser.uid });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Аутентификация пользователя через Firebase
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password' });
    }

    try {
        // Получаем пользователя из Firebase
        const userQuery = await firestoreDb.collection('users').where('email', '==', email).get();
        if (userQuery.empty) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const userData = userQuery.docs[0].data();

        // Проверяем, существует ли пользователь в Firebase Authentication Emulator
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // В случае эмулятора, мы просто проверяем пароль с самим email и password
        // В реальных условиях вы можете хранить пароли хешированными и сравнивать хеши
        if (password !== process.env.DEFAULT_PASSWORD) {
            // Используйте правильную проверку пароля
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (userData.status === 'blocked') {
            return res.status(403).json({ error: 'User is blocked' });
        }

        const token = jwt.sign({ userId: userQuery.docs[0].id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

        // Обновляем последнее время входа пользователя в Firestore
        await firestoreDb.collection('users').doc(userQuery.docs[0].id).update({ last_login: new Date() });

        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Остальные функции могут быть адаптированы аналогично, изменив логику на работу с Firebase и Firestore
module.exports = {
    registerUser,
    loginUser,
};
