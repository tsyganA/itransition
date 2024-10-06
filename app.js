const express = require('express');
const { dbRealtime } = require('./backend/config/firebaseConfig'); // Подключаем обновленный конфиг
const app = express();

// Маршрут для получения пользователей из Realtime Database
app.get('/users', async (req, res) => {
    try {
        const snapshot = await dbRealtime.ref('users').once('value'); // Получаем данные из Realtime Database
        const users = snapshot.val();
        res.status(200).json(users); // Отправляем данные как JSON-ответ
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
});

const PORT = process.env.PORT || 3000; // Устанавливаем порт
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
