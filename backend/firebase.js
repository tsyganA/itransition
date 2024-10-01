const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

// Создание пользователя в Firebase
const createUser = async (email, password, displayName) => {
    return await auth.createUser({
        email,
        password,
        displayName,
    });
};

// Проверка Firebase токена
const verifyToken = async idToken => {
    return await auth.verifyIdToken(idToken);
};

module.exports = { createUser, verifyToken };
