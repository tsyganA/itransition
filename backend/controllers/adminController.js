// adminController.js
const admin = require('firebase-admin');

// Инициализация Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

// Получение всех пользователей
const listAllUsers = async (req, res) => {
    try {
        const userRecords = await admin.auth().listUsers();
        const users = userRecords.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
        }));
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Unable to fetch users' });
    }
};

module.exports = {
    listAllUsers,
};
