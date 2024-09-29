import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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

            const response = await axios.get('http://localhost:3000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login');
            } else {
                setError(error.message);
            }
        } finally {
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

    const handleDeleteUsers = async () => {
        // Проверяем, если выбран текущий пользователь
        if (selectedUsers.includes(parseInt(currentUserId))) {
            if (!window.confirm('Вы уверены, что хотите удалить свой аккаунт?')) {
                return; // Если отмена, прерываем процесс удаления
            }
        }

        try {
            const response = await axios.delete('http://localhost:3000/api/users/delete', {
                data: { userId: selectedUsers },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                // Проверяем, удаляется ли собственный аккаунт
                if (selectedUsers.includes(parseInt(currentUserId))) {
                    alert('Ваш аккаунт был удалён. Пожалуйста, выполните повторный вход.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload(); // Обновление страницы
                } else {
                    setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                    setSelectedUsers([]);
                }
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

    const updateUsersStatus = async (status, confirmMessage = '') => {
        const token = localStorage.getItem('token');

        // Проверяем, если выбран текущий пользователь для блокировки
        if (status === 'blocked' && selectedUsers.includes(parseInt(currentUserId))) {
            if (!window.confirm('Вы уверены, что хотите заблокировать свой аккаунт?')) {
                return; // Если отмена, прерываем процесс блокировки
            }
        }

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
                // Проверяем только для блокировки, нужно ли показывать предупреждение о собственном аккаунте
                if (status === 'blocked' && selectedUsers.includes(parseInt(currentUserId))) {
                    alert('Ваш аккаунт был заблокирован. Пожалуйста, выполните повторный вход.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload(); // Обновление страницы
                } else {
                    setUsers(prevUsers => prevUsers.map(user => (selectedUsers.includes(user.id) ? { ...user, status } : user)));
                    setSelectedUsers([]);
                }
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
        // Блокировка с подтверждением только если текущий пользователь выбран
        updateUsersStatus('blocked');
    };

    const handleUnblock = () => {
        updateUsersStatus('active'); // Подтверждения нет, потому что unblock не требует подтверждения
    };

    const formatDateTime = dateString => {
        if (!dateString) return 'Did not enter';
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString(); // Получаем дату
        const timePart = date.toLocaleTimeString(); // Получаем время
        return `${datePart} ${timePart}`; // Объединяем без запятой
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <p>Error: {error}</p>
                <button className="btn btn-secondary" onClick={() => setError(null)}>
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="text-center">Users List</h2>

            <div className="mb-3 d-flex justify-content-center gap-3">
                <button className="btn btn-danger" onClick={handleBlock} disabled={selectedUsers.length === 0}>
                    Block
                </button>

                <button
                    className="btn btn-success"
                    onClick={handleUnblock}
                    disabled={selectedUsers.length === 0}
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                >
                    <i className="bi bi-unlock-fill" style={{ fontSize: '3rem', color: 'green' }}></i>
                </button>
                <button
                    className="btn btn-warning"
                    onClick={handleDeleteUsers}
                    disabled={selectedUsers.length === 0}
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                >
                    <i className="bi bi-trash-fill" style={{ fontSize: '3rem', color: 'blue' }}></i>
                </button>
            </div>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="table table-striped">
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
                                <td>{user.status === 'blocked' ? 'Blocked' : user.status === 'active' ? 'Active' : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UsersTableWithActions;
