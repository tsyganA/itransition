// user-sync/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require('../backend/firebaseServiceAccountKey.json')), // Убедитесь, что путь к файлу правильный
    databaseURL: 'https://chat-react-7a32a-default-rtdb.firebaseio.com', // Замените на ваш URL базы данных
});

// Функция для добавления пользователя в базу данных при его создании в Firebase Authentication
exports.syncUserData = functions.auth.user().onCreate(async user => {
    try {
        // Проверка наличия uid
        if (!user || !user.uid) {
            throw new Error('User object is undefined or uid is missing');
        }

        // Ссылка на путь в Realtime Database, куда добавляется пользователь
        const userRef = admin.database().ref(`users/${user.uid}`);

        // Добавление данных пользователя в Realtime Database
        await userRef.set({
            displayName: user.displayName || null,
            email: user.email || null,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
        });

        // Логирование успешного добавления пользователя
        console.log('User added to database:', user.uid);
    } catch (error) {
        // Обработка ошибок, если они возникнут при добавлении пользователя
        console.error('Error adding user to database:', error);
    }
});
