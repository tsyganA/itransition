import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Импортируем jwt-decode для работы с токеном

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

            if (data.token) {
                const decodedToken = jwtDecode(data.token);
                const userId = decodedToken.userId;

                console.log('Decoded Token:', decodedToken);
                console.log('UserId:', userId);

                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', userId);

                onLogin(data.token);
                onClose();
            } else {
                throw new Error('Login failed. No token received.');
            }
        } catch (err) {
            setError(err.message);
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
