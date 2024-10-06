const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
admin.initializeApp({
    databaseURL: 'http://127.0.0.1:9000/?ns=chat-react-7a32a-default-rtdb', // Укажите URL вашего эмулятора
});

const app = express();
app.use(cors());
app.use(express.json());

// Получение списка пользователей
app.get('/api/users', async (req, res) => {
    try {
        const snapshot = await admin.database().ref('users').once('value');
        const users = snapshot.val();

        // Преобразование данных в массив
        const usersList = Object.keys(users).map(key => ({
            id: key,
            ...users[key],
        }));

        res.json(usersList);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
