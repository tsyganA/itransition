import React, { useState } from 'react';

const Register = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }), // Отправляем введенные данные
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем token и userId в localStorage, если регистрация успешна
                if (data.token && data.userId) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                }

                setSuccess(true); // Отображаем сообщение об успешной регистрации
                setTimeout(onClose, 2000); // Закрываем модальное окно через 2 секунды
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to register. Please try again.');
        }
    };

    const handleBackdropClick = e => {
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={handleBackdropClick}>
            <div className="modal-dialog custom-modal" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Register</h5>
                    </div>
                    <div className="modal-body">
                        {success ? (
                            <p className="text-success">Registration successful! You can now log in.</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
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
                                    />
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <button type="submit" className="btn btn-primary w-100">
                                    Sign Up
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
