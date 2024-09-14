const express = require('express');
const userRoutes = require('./routes/userRoutes');
const { createUserTable } = require('./models/userModel');

const app = express();
app.use(express.json());

createUserTable(); // Создаем таблицу при старте

app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
