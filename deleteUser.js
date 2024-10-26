const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require('../itransition/backend/firebaseServiceAccountKey.json')), // Укажите путь к вашему файлу serviceAccountKey.json
});

const deleteUser = async uid => {
    try {
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user with uid: ${uid}`);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Вызовите функцию с нужным UID
deleteUser('iOBuoTUBuzQlVU1l2YW5m4PfdfN2');
