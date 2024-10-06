import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseClient'; // Убедитесь, что этот путь правильный

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        try {
            // Регистрация пользователя через Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Registration successful:', user);
            setSuccess(true);
            setTimeout(() => {
                setEmail('');
                setPassword('');
                setSuccess(false); // сбросим успех, если вам нужно
            }, 2000); // Задержка для отображения успешного сообщения
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message); // Установка сообщения об ошибке
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">Registration successful!</p>}
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
