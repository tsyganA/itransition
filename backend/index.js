const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json()); // Middleware для парсинга JSON
app.use('/api/auth', authRoutes); // Подключение маршрутов аутентификации

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
