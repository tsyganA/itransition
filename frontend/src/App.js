import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Modal from './components/Modal';
// Импортируем компонент с тулбаром и множественным выбором
import UsersTableWithActions from './components/UsersTableWithActions';
import './App.css'; // Подключите стили для модальных окон

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleLogin = token => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setIsLoginOpen(false);
    };

    return (
        <div className="App">
            {!isAuthenticated ? (
                // Используем flexbox и отцентрируем кнопки по центру
                <div className="d-flex flex-column align-items-center mt-10">
                    {/* Уменьшаем длину кнопок с помощью btn-sm и w-auto */}
                    <h1 className="text-center mb-5 display-6">System for registration and login</h1>
                    <button className="btn btn-primary w-25 mb-3" onClick={() => setIsLoginOpen(true)}>
                        Login
                    </button>
                    <button className="btn btn-primary w-25" onClick={() => setIsRegisterOpen(true)}>
                        Register
                    </button>
                </div>
            ) : (
                // Заменяем UsersTable на UsersTableWithActions
                <UsersTableWithActions />
            )}

            <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
                <Login onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
            </Modal>

            <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
                <Register onClose={() => setIsRegisterOpen(false)} />
            </Modal>
        </div>
    );
}

export default App;
