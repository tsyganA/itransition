import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Импортируем jwt-decode для работы с токеном

const Login = ({ onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            // Отправляем запрос на сервер для логина
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();

            // Проверяем наличие токена в ответе
            if (data.token) {
                // Декодируем токен для получения userId
                const decodedToken = jwtDecode(data.token);
                const userId = decodedToken.userId; // Извлекаем userId из токена

                console.log('Decoded Token:', decodedToken); // Для отладки
                console.log('UserId:', userId); // Логируем userId

                // Сохраняем токен и userId в localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', userId);

                onLogin(data.token); // Передаем токен через onLogin
                onClose(); // Закрываем модальное окно
            } else {
                throw new Error('Login failed. No token received.');
            }
        } catch (err) {
            setError(err.message); // Отображаем ошибку, если что-то пошло не так
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение ошибки */}
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
