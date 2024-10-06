const admin = require('firebase-admin');

// Подключаем ключ сервисного аккаунта
const serviceAccount = require('../firebaseServiceAccountKey.json');

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'http://localhost:9000', // URL эмулятора Realtime Database
});

// Инициализация Realtime Database и Firestore
const dbRealtime = admin.database(); // Realtime Database
const dbFirestore = admin.firestore(); // Firestore
const auth = admin.auth(); // Firebase Authentication

// Проверка наличия эмуляторов
if (process.env.FIREBASE_EMULATOR) {
    // Подключение к эмуляторам, если они запущены
    console.log('Connecting to Firebase Emulators...');
    dbRealtime.useEmulator('localhost', 9000); // Эмулятор Realtime Database
    dbFirestore.settings({
        host: 'localhost:8080', // Эмулятор Firestore
        ssl: false,
    });
    auth.useEmulator('http://localhost:9099'); // Эмулятор Authentication
}

module.exports = { dbRealtime, dbFirestore, auth };
