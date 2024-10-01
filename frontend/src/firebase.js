// frontend/src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBPW85YuwNHu_bIvg4BG1-c3cOFN1cuLYsYOUR_API_KEY',
    authDomain: 'chat-react-7a32a.firebaseapp.com',
    projectId: 'chat-react-7a32a',
    storageBucket: 'chat-react-7a32a.appspot.com',
    messagingSenderId: '1084989245328',
    appId: '1:1084989245328:web:044819715f56cc41151515',
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Получение экземпляров служб
export const auth = getAuth(app);
export const db = getFirestore(app);
