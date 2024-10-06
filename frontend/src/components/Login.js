import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Импортируем метод для входа через Firebase
import { auth } from '../firebase'; // Импорт Firebase

const Login = ({ onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Обработчик клика для закрытия модального окна
    const handleBackdropClick = e => {
        // Если клик был по самой модалке, не закрываем
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            // Используем Firebase Authentication для входа пользователя
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Logged in user:', user);

            // Сохраняем токен и UID пользователя
            const token = await user.getIdToken();
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.uid);

            // Вызываем callback для обновления состояния аутентификации
            onLogin(token);
            onClose();
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={handleBackdropClick}>
            <div className="modal-dialog custom-modal" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                    </div>
                    <div className="modal-body">
                        {error && <p className="text-danger">{error}</p>} {/* Отображение ошибки */}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
