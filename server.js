const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        type: 'service_account',
        project_id: 'chat-react-7a32a',
        private_key_id: '2700208f66d4a0590eb4d8a3f3cd15f2cfb2a385',
        private_key:
            '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChwOYPpOuQvqdU\ns9nJ29LoUtxRsOKJCy+hl42a8IUrJPypA8/2GZuEXCCfVM9HDIST06cHzk7sVp5D\nMqCTNkN+HU7p2Xb1aL2jBiSsYqX8xBBydDV61MNHS62bUgTqWfYUKWoEmhtez7ra\ngLOj4X9/l5pOJJ9t9bJyX7+LcqSMYac2ncZEgO6uJ1xsmX6qHXiz2WIUK7N9bf5/\nBY6zaZFcfhJDzrF6El6YjJIat64vVXIjjg82+OKvwcMdUQpSmdLGABoFChR14cC/\n+mbQxdvcBohcnpQTBBzqm/enfBNE8wR1F1OeOci5maiXrNrH7W9lhPaa7KOgWWUR\nOKF3r3iJAgMBAAECggEAASyAy7URe8SgB9ghfBRUtkuzpM9Sm+/+C0wp3BzJ7dA5\ns5Hlg0Gx6tOVIQYUIwEPDT7IXYdWJ0m4CE2bwLW9TT/LmZxyzCeG1ZU71H+hK/Ge\ntO+G9W2jcfPPCx62dNG5gwslGJ3afDIOhxUCa+2jZ6E80dUnzjwUOXEPo/46MRKZ\nYNN+dxLBIZTMRqAmsHEg3oZJqhlI6fIsBa6vG/CNkt6qZklM4U0Ce9v4RI9zs2Bw\nC7Al6NBxSppWkbinID8OMBWDEVGPIuVBvkpZc2JKtby9p0C6z6CwhPi6gojIEeTO\nYtjZA4FtRmwHAzVa91hNO6kjk3UNo+ymh+eyu26GIQKBgQDidPYsPXi2qVeysc2u\njdbcDTmpe/xlp6Ulr6UNMdWve3NWmUMfawHgrklDJBH4QyBI8b49PFxnPI1+v3QT\njzqFFQSnG/i7JZ08NNAPH7ZXQumEoHC2e3R8CcA2wG0jYRQ+yEDDjVFX26azxuO1\nYf7rGLfSBimspvlanNWuJduUTQKBgQC22wWkRa0Ir5Z335leii4472u6+Fi+bI+X\npoTluARRuAE45J/T1aMEOsJFa36ZfJqqhsD3I8LAADbdohqEKp87NSCB9yftMzR0\n2sdwz462v7vO/P7k73W2YEtYqQAvsCfTbRbMl6sWvBc3ipzqBvHdrDKIYL/KT1dm\nF3dG5X+DLQKBgF6PhHP4vz1W/R3LDR4EcGG2zAsvkLdKB7Xy4DLgSmBaZlEU8mhe\nIIyXelQk7bQDI6oR9+ROHi+lo1f3zhqUxlTn7+dv0K8lB8EqNG78SQGrGSOeczJf\n3sYktDSoqWoKkY+dwx1lF0Beof+T32XQI8g7rBZxKFnF532k2706ZbRJAoGAWywn\nyvmmxi7uooSNrzLMyzythYMwlHoCusWfe/7dwHUzvs9X1cKuznwRw5VOgW88mwwn\niNJ+10cEFEwwVnf9/wKFW+gFM2MVo7I2QUxsRzighxtkaHfxRGcNCn7xhdWadfPt\nq0NwXhyYouvtQ08FJ9clNxSubExVMqU+ps3lX10CgYEAr45IErPhw5V/zN8oxLD3\nAAIrLtVq5/CGdPENYKxWE7HhqJff7p/vq25zOsWBUs7zw8AtoF8i34USez3BHUDQ\nreKzQZQ76i6d7b/6K33DZYbSV0zWWKPjf2JYb6/P7xCxBGRTHsvj6jZwArDPPJKn\n906zkao76SCEpe0W11c0f6M=\n-----END PRIVATE KEY-----\n',
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
