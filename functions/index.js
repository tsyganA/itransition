// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Инициализация Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require('../backend/firebaseServiceAccountKey.json')),
    databaseURL: 'https://chat-react-7a32a-default-rtdb.firebaseio.com', // Используется для RTDB (необязательно для Firestore)
});

// Настройка Firestore для использования эмулятора
if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('Using Firestore emulator at:', process.env.FIRESTORE_EMULATOR_HOST);
    const firestore = admin.firestore();
    firestore.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false,
    });
} else {
    console.log('Using Firestore production database');
}

// Функция, вызываемая при создании пользователя в Firebase Authentication
exports.onUserCreate = functions.auth.user().onCreate(async user => {
    try {
        console.log('User created:', user); // Логируем данные пользователя

        const { uid, email, displayName } = user;

        // Сохраняем данные пользователя в Firestore (или эмуляторе)
        await admin
            .firestore()
            .collection('users') // Коллекция 'users'
            .doc(uid) // Документ с ID пользователя
            .set({
                uid: uid,
                email: email,
                displayName: displayName || 'Unnamed User', // Используем "Unnamed User", если имя не указано
                createdAt: admin.firestore.FieldValue.serverTimestamp(), // Время создания
            });

        console.log(`User ${uid} added to Firestore`);
    } catch (error) {
        console.error('Error adding user to Firestore:', error);
    }
});

// HTTP-функция для регистрации пользователя и добавления его в Firestore
exports.createUserAndAddToFirestore = functions.https.onRequest(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });

        console.log(`User created with UID: ${userRecord.uid}`);

        // Добавление пользователя в Firestore
        const userRef = admin.firestore().collection('users').doc(userRecord.uid);
        await userRef.set({
            email: userRecord.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).send(`User created successfully with UID: ${userRecord.uid}`);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});
