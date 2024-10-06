// firebaseClient.js
import { initializeApp, getApps } from 'firebase/app'; // Импортируем getApps для проверки существующих приложений
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Конфигурация вашего Firebase проекта
const firebaseConfig = {
    apiKey: 'AIzaSyBPW85YuwNHu_bIvg4BG1-c3cOFN1cuLYs',
    authDomain: 'chat-react-7a32a.firebaseapp.com',
    projectId: 'chat-react-7a32a',
    storageBucket: 'chat-react-7a32a.appspot.com',
    messagingSenderId: '1084989245328',
    appId: '1:1084989245328:web:044819715f56cc41151515',
    databaseURL: 'https://chat-react-7a32a-default-rtdb.firebaseio.com', // URL Realtime Database
};

// Проверяем, существует ли уже приложение
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Инициализация аутентификации
const auth = getAuth(app);

// Инициализация Firestore и Realtime Database
const dbFirestore = getFirestore(app);
const dbRealtime = getDatabase(app);

// Подключение к эмуляторам (локальная среда)
if (window.location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099'); // Подключение к эмулятору аутентификации
    connectFirestoreEmulator(dbFirestore, 'localhost', 8080); // Подключение к эмулятору Firestore
    connectDatabaseEmulator(dbRealtime, 'localhost', 9000); // Подключение к эмулятору Realtime Database
}

export { auth, dbFirestore, dbRealtime };
