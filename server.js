const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        type: 'service_account',
        project_id: 'chat-react-7a32a',
        private_key_id: '80babf31ae3688e0e28dbbe0be3f1cb7aa76da82',
        private_key:
            '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDnl+38dS3xmpNp\nKWJBtjUIpnz07C7VII5RqmT62xwGEvQD7H6bsQYuxBVBioAsHk/F4Hx/XOTFm8GW\nZt86NLnBSXvwIWgSJ87uXreuuMUGypsYhQFyI80qA2sztxg1iR/SsirCiV55FmWw\nbIp9EqpdOdnVY3xQ0gfX3abF5aj8yBCwCYwiTXjG1K4Q+14AT29JaQrYq8aoxpEg\ndpcQ1fdK5zdpULzB3usoTU7hi1MPt4ZbYjcnY21DMxo2XICdlA7YTIVw64KO46oq\nAAT5B7tG24Mp4k2cErJooHj8KbKJXR58i5CHZj4yyGSEqQIjpaUPWDK6O1jPj9rs\nn9ffqfpBAgMBAAECggEAMgwUi1p9R7lKQs8FI0MvWcO0vC7v/fGvn7lNYiKIf02I\nOvLX92g9eEy6dTPrd91DCvV0ogdejs+WeZyYf9kWDU2GgYGOnmHI551DX3ghZ9LP\nynAvvE09UGd1urLGAge0f1EuSWTrLAqphgMmuFmYxFW0m9cIbeS9eio1mI2FQ77F\nEQSglS8oT4qSS5+L7iakAr6BkLN8zu03/2qJTk2mptapQlKGknPH7bqYVmnjl/au\nIMeQrJE8y13WrvCo6S37IHGWyAzYDgu9Su9BFcVuyhXLBRzL4mF2zJeqOwJ1imbR\nA+TiT+U4KK0cBZyx8EFp+MENdAFQAvWuL5jptESBCwKBgQD2y9g0QyoraMcz6Uzp\nQGnB4KpkvAbEaWCpCiHqTx6oT4shULNA/QljoXtXQ49Lx5bgQ8ziyQ612gzh2y2S\nGde+Z045pxyPqkHG+GMLpmvubn5de5np2Yb89GhBHNECTXIuZbfq5Adm3p7k1Ou9\n5X0L6FmRduK2pkUJKQi7SBc2bwKBgQDwOvHN+6X2x7xNHYjiYqte4WatSMajil4N\n0XhRBj4Z8oYjXTnlbEYbuMXDyxkMlvXsu8W151a+UqkUao9Jun+ebBTzO2CFbWqd\nQUZtFuBeufe9TZ28MW9jv/ei4O8GWaVpDvA9R+o0k0BOlpwh7TVUIF6QZa+GJdPH\nI7Bk+UmyTwKBgFadula1T+KGVouQkO64LaXezM6n8xQSC9un87lBZXga2rCpmw/u\n/tGZxikdS/iDpx80jH73o5MNYUIPY5IIQeDQbvLrBKojTgyf9lsLYIwA+Zajn6Qk\nNS0oNkLL80sElVNVXdQxjat77HZRiB9QoK+CL5VPDUifWFFbtnXMWmE/AoGAaLfJ\nIBlKR0DZ/GObf9OzEDEBKRhIPpHaXfupjuhBud3WSyQgULnZ9cudqbOmv64ulXtk\nu96UGXK+8X9h5qm9Z7mFiGGhuYfwqYwCvxrxw1kdfQ+QarDB9aGAuSeECiiZyioQ\n3yWyGij2J0vP05orXPifQCKTWM60emI8SkfAsFECgYAnH9U3AfiFCGxBEDETnF15\nxrylZLgwclTVbClpM0nqJFzryDACrmUz7xAnJSLwh0hxyBgXxbtM2zgL39B/BsN3\nH3rEqCMoWNTyToLG3eccA0w/2vOmvknWHd2Wt+MBozqBEZVM/f6P24lwFbW77Ihw\n95KEhZYj+B6eCdKv3YMjnw==\n-----END PRIVATE KEY-----\n',
        client_email: 'firebase-adminsdk-v43q0@chat-react-7a32a.iam.gserviceaccount.com',
        client_id: '111034466544089756070',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v43q0%40chat-react-7a32a.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com',
    }),
    databaseURL: 'https://chat-react-7a32a.firebaseio.com',
});

const app = express();

// Настройки CORS
const allowedOrigins = ['https://chat-react-7a32a.web.app'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: 'GET,POST,DELETE,PUT',
};

app.use(cors(corsOptions));
app.use(express.json());

// Главный маршрут
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Маршрут для удаления пользователя из Authentication
app.delete('/api/deleteUser/:uid', async (req, res) => {
    const uid = req.params.uid;

    try {
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user with uid: ${uid}`);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user from Authentication.' });
    }
});

// Маршрут для блокировки пользователя
app.post('/api/blockUser', async (req, res) => {
    const { uid } = req.body;

    try {
        await admin.auth().updateUser(uid, { disabled: true });
        console.log(`Successfully blocked user with uid: ${uid}`);
        res.status(200).json({ message: 'User successfully blocked.' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Failed to block user.' });
    }
});

// Маршрут для разблокировки пользователя
app.post('/api/unblockUser', async (req, res) => {
    const { uid } = req.body;

    try {
        await admin.auth().updateUser(uid, { disabled: false });
        console.log(`Successfully unblocked user with uid: ${uid}`);
        res.status(200).json({ message: 'User successfully unblocked.' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Failed to unblock user.' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
