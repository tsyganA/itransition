const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Импорт маршрутов для администрирования
const { createUserTable } = require('./models/userModel');
require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Проверка загрузки переменной

const app = express();

// Настройка CORS для конкретного источника
const corsOptions = {
    origin: 'https://chat-react-7a32a.web.app', // Разрешаем только нужный источник
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Разрешаем передавать куки, если необходимо
};

app.use(cors(corsOptions)); // Использование CORS middleware
app.use(express.json());

// Создание таблицы пользователей
(async () => {
    try {
        await createUserTable();
        console.log('User table created successfully.');
    } catch (err) {
        console.error('Error creating user table:', err);
    }
})();

// Открытые маршруты
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); // Подключение маршрутов для администрирования

// Обработка ошибок 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Обработка внутренних ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
