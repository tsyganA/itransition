const express = require('express');
const admin = require('./firebaseConfig'); // Ваш файл конфигурации Firebase
const app = express();

app.get('/users', async (req, res) => {
    try {
        const usersRef = admin.database().ref('/users');
        const snapshot = await usersRef.once('value');
        const users = snapshot.val();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Unable to fetch users' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
