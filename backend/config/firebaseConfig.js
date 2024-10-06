const admin = require('firebase-admin');

// Подключаем ключ сервисного аккаунта
const serviceAccount = require('../firebaseServiceAccountKey.json');

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chat-react-7a32a-default-rtdb.firebaseio.com', // URL Realtime Database
});

// Инициализация Realtime Database и Firestore
const dbRealtime = admin.database(); // Realtime Database
const dbFirestore = admin.firestore(); // Firestore
const auth = admin.auth(); // Firebase Authentication

module.exports = { dbRealtime, dbFirestore, auth };
