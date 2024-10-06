import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebaseClient'; // Импортируем auth из файла firebase.js
import { getDatabase, ref, set } from 'firebase/database'; // Импорт для работы с Realtime Database

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
            // Создаем пользователя через Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Обновляем профиль пользователя с именем
            await updateProfile(user, { displayName: name });

            // Сохраняем пользователя в Realtime Database
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            await set(userRef, {
                displayName: user.displayName,
                email: user.email,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
            });

            setSuccess(true);
            setTimeout(onClose, 2000); // Закрыть модальное окно через 2 секунды
        } catch (error) {
            setError(error.message || 'Something went wrong');
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
                                        required
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
