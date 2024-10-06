// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK с использованием сервисного аккаунта
admin.initializeApp({
    credential: admin.credential.cert(require('../backend/firebaseServiceAccountKey.json')),
    databaseURL: 'https://chat-react-7a32a-default-rtdb.firebaseio.com',
});

// Проверка, используем ли мы эмуляторы для Auth и Realtime Database
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log('Using Firebase Authentication emulator at:', process.env.FIREBASE_AUTH_EMULATOR_HOST);
}

if (process.env.FIREBASE_DATABASE_EMULATOR_HOST) {
    console.log('Using Realtime Database emulator at:', process.env.FIREBASE_DATABASE_EMULATOR_HOST);
    admin.database().useEmulator('localhost', 9000);
}

// Функция для обработки создания пользователя
exports.onUserCreate = functions.auth.user().onCreate(async user => {
    try {
        console.log('User data received:', user); // Отладочное сообщение

        // Проверяем, если user определен
        if (!user || !user.uid) {
            throw new Error('User data is undefined or uid is missing');
        }

        const { uid, email, displayName } = user;

        // Сохранение данных пользователя в Realtime Database
        await admin
            .database()
            .ref(`/users/${uid}`)
            .set({
                uid,
                email,
                displayName: displayName || '', // Проверяем, есть ли displayName
                createdAt: admin.database.ServerValue.TIMESTAMP,
            });

        console.log(`User data saved in Realtime Database for user: ${uid}`);
    } catch (error) {
        console.error('Error saving user data to Realtime Database:', error);
    }
});

console.log('Firebase initialized in index.js');
