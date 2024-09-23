import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';

function Home() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
    };

    const closeModal = () => {
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    // Закрытие модального окна при клике вне его
    useEffect(() => {
        const handleOutsideClick = event => {
            if (event.target.className === 'modal') {
                closeModal();
            }
        };
        window.addEventListener('click', handleOutsideClick);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <div>
                <button onClick={handleLoginClick}>Login</button>
                <button onClick={handleRegisterClick}>Register</button>
            </div>

            {/* Модальное окно для Login */}
            {showLoginModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={closeModal}>
                            &times;
                        </button>
                        <Login />
                    </div>
                </div>
            )}

            {/* Модальное окно для Register */}
            {showRegisterModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={closeModal}>
                            &times;
                        </button>
                        <Register />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
