const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require('../backend/firebaseServiceAccountKey.json')),
});

// Cloud Function для удаления пользователя
exports.deleteUserFromAuth = functions.https.onRequest(async (req, res) => {
    // Проверка метода запроса
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { uid } = req.body;

    if (!uid) {
        return res.status(400).send('UID is required');
    }

    try {
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user with uid: ${uid}`);
        res.status(200).send(`User ${uid} deleted successfully`);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});
