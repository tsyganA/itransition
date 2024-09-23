import React, { useState } from 'react';

const Register = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        // Очистка сообщений об ошибках
        setError(null);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Если регистрация успешна, показываем сообщение об успехе
                setSuccess(true);
                setTimeout(onClose, 2000); // Закрыть модальное окно через 2 секунды
            } else {
                // Если ошибка, отображаем её
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            // Обработка ошибки сети или другого рода
            setError('Failed to register. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Register</h2>
                {success ? (
                    <p>Registration successful! You can now log in.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                        <label>Email:</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <label>Password:</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        {error && <p className="error">{error}</p>}
                        <button type="submit">Sign Up</button>
                    </form>
                )}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Register;
