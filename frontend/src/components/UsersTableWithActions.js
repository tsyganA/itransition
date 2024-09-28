import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersTableWithActions = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        console.log('Token:', token); // Лог токена
        console.log('UserId:', userId); // Лог userId

        if (!token || !userId) {
            setError('You must be logged in to view this page.');
            navigate('/login', { replace: true });
            return;
        }

        setCurrentUserId(userId); // Устанавливаем userId в state
        fetchUsers(token);
    }, [navigate]);

    const fetchUsers = async token => {
        try {
            setLoading(true);
            console.log('Fetching users...'); // Лог перед запросом

            const response = await axios.get('http://localhost:3000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Users fetched:', response.data); // Лог ответа сервера
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error); // Лог ошибки
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login');
            } else {
                setError(error.message);
            }
        } finally {
            console.log('Fetching finished'); // Лог завершения запроса
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]); // Снять выделение
        } else {
            setSelectedUsers(users.map(user => user.id)); // Выделить всех
        }
    };

    const handleSelectUser = userId => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSelfAction = () => {
        if (selectedUsers.includes(parseInt(currentUserId))) {
            if (window.confirm('Вы собираетесь удалить или заблокировать свой собственный аккаунт. Вы уверены?')) {
                alert('Ваш аккаунт был удалён или заблокирован. Пожалуйста, выполните повторный вход.');

                // Удаляем токен и userId из localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('userId');

                // Обновляем страницу
                window.location.reload(); // Обновление страницы
            } else {
                setSelectedUsers(selectedUsers.filter(id => id !== parseInt(currentUserId)));
            }
        }
    };

    const handleDeleteUsers = async () => {
        try {
            const response = await axios.delete('http://localhost:3000/api/users/delete', {
                data: { userId: selectedUsers },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                handleSelfAction();
                setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login');
            } else {
                setError(error.message);
            }
        }
    };

    const updateUsersStatus = async status => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:3000/api/users/update',
                { userId: selectedUsers, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                handleSelfAction();
                setUsers(prevUsers => prevUsers.map(user => (selectedUsers.includes(user.id) ? { ...user, status } : user)));
                setSelectedUsers([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login');
            } else {
                setError(error.message);
            }
        }
    };

    const handleBlock = () => {
        updateUsersStatus('blocked');
    };

    const handleUnblock = () => {
        updateUsersStatus('active');
    };

    const formatDateTime = dateString => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString(); // Получаем дату
        const timePart = date.toLocaleTimeString(); // Получаем время
        return `${datePart} ${timePart}`; // Объединяем без запятой
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>Error: {error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
            </div>
        );
    }

    return (
        <div>
            <h2>User List</h2>

            <div className="toolbar">
                <button onClick={handleBlock} disabled={selectedUsers.length === 0}>
                    Block
                </button>
                <button onClick={handleUnblock} disabled={selectedUsers.length === 0}>
                    Unblock
                </button>
                <button onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
                    Delete
                </button>
            </div>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedUsers.length === users.length && users.length > 0}
                                />
                            </th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registration Date</th>
                            <th>Last Login</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} />
                                </td>
                                <td>{user.id}</td>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.email || 'N/A'}</td>
                                <td>{formatDateTime(user.registration_date)}</td>
                                <td>{formatDateTime(user.last_login)}</td>
                                <td>{user.status || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UsersTableWithActions;
