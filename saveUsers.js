const { db, auth } = require('./backend/config/firebaseConfig'); // Подключаем конфигурацию Firebase

// Функция для записи пользователей в Realtime Database
const saveUsersToDatabase = async () => {
    try {
        const listUsersResult = await auth.listUsers(); // Получаем список всех пользователей
        listUsersResult.users.forEach(userRecord => {
            const userData = {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName || null,
                creationTime: userRecord.metadata.creationTime,
                lastSignInTime: userRecord.metadata.lastSignInTime,
            };

            // Запись данных в Realtime Database
            db.ref('users/' + userRecord.uid).set(userData);
        });
        console.log('Пользователи успешно сохранены в Realtime Database.');
    } catch (error) {
        console.error('Ошибка при сохранении пользователей:', error);
    }
};

saveUsersToDatabase(); // Вызываем функцию сохранения
