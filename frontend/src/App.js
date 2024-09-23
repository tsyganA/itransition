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
            <h1>Welcome to Our App</h1>
            {!isAuthenticated ? (
                <>
                    <button onClick={() => setIsLoginOpen(true)}>Login</button>
                    <button onClick={() => setIsRegisterOpen(true)}>Register</button>
                </>
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
