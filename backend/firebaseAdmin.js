const admin = require('firebase-admin');

// Подключаем ключ сервисного аккаунта
const serviceAccount = require('../backend/firebaseServiceAccountKey.json');

// Проверяем, было ли уже инициализировано приложение Firebase
if (!admin.apps.length) {
    // Инициализация Firebase Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://chat-react-7a32a-default-rtdb.firebaseio.com', // URL Realtime Database
    });
}

// Инициализация Realtime Database и Firestore
const dbRealtime = admin.database(); // Realtime Database
const dbFirestore = admin.firestore(); // Firestore
const auth = admin.auth(); // Firebase Authentication

// Подключение к эмуляторам, если запущены и настроены
if (process.env.FIREBASE_EMULATOR === 'true') {
    console.log('Connecting to Firebase Emulators...');

    // Realtime Database Emulator
    dbRealtime.useEmulator('localhost', 9000);

    // Firestore Emulator
    dbFirestore.settings({
        host: 'localhost:8080',
        ssl: false,
    });

    // Authentication Emulator
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

module.exports = { dbRealtime, dbFirestore, auth };
