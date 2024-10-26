const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('../itransition/backend/firebaseServiceAccountKey.json'); // Укажите путь к вашему файлу serviceAccountKey.json

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'http://127.0.0.1:9000/?ns=chat-react-7a32a-default-rtdb', // Укажите URL вашего эмулятора или настоящей базы данных
});

const app = express();
app.use(cors());
app.use(express.json());

// Маршрут для удаления пользователя из Authentication
app.delete('/api/deleteUser/:uid', async (req, res) => {
    const uid = req.params.uid; // UID пользователя, которого нужно удалить

    try {
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user with uid: ${uid}`);
        res.status(204).send(); // Успешное удаление без тела ответа
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user from Authentication.' });
    }
});

// Маршрут для блокировки пользователя
app.post('/api/blockUser', async (req, res) => {
    const { uid } = req.body;

    try {
        await admin.auth().updateUser(uid, { disabled: true });
        console.log(`Successfully blocked user with uid: ${uid}`);
        res.status(200).json({ message: 'User successfully blocked.' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Failed to block user.' });
    }
});

// Маршрут для разблокировки пользователя
app.post('/api/unblockUser', async (req, res) => {
    const { uid } = req.body;

    try {
        await admin.auth().updateUser(uid, { disabled: false });
        console.log(`Successfully unblocked user with uid: ${uid}`);
        res.status(200).json({ message: 'User successfully unblocked.' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Failed to unblock user.' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
