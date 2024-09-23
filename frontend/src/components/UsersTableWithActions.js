import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersTableWithActions = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to view this page.');
            return;
        }

        axios
            .get('http://localhost:3000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => setUsers(response.data))
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(error.message);
                }
            });
    }, [navigate]);

    const handleSelectAll = e => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = id => {
        setSelectedUsers(prevSelected => (prevSelected.includes(id) ? prevSelected.filter(userId => userId !== id) : [...prevSelected, id]));
    };

    const handleSelfAction = () => {
        alert('Вы были заблокированы или удалены. Выполните повторный вход.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleDeleteUsers = async () => {
        try {
            const response = await axios.delete('http://localhost:3000/api/users/delete', {
                data: { userId: selectedUsers },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (selectedUsers.includes(currentUserId)) {
                handleSelfAction();
            } else {
                setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error('Ошибка при удалении пользователей:', error);
                setError(error.message);
            }
        }
    };

    const updateUsersStatus = async status => {
        const token = localStorage.getItem('token');

        try {
            await axios.post(
                'http://localhost:3000/api/users/update',
                {
                    userId: selectedUsers,
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers(prevUsers => prevUsers.map(user => (selectedUsers.includes(user.id) ? { ...user, status } : user)));
            setSelectedUsers([]);
        } catch (error) {
            console.error('Ошибка при обновлении статуса пользователей:', error);
            setError(error.message);
        }
    };

    const handleBlock = () => {
        updateUsersStatus('Blocked');
    };

    const handleUnblock = () => {
        updateUsersStatus('Active');
    };

    if (error) {
        return <div>Error: {error}</div>;
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
                                <td>{user.registration_date ? new Date(user.registration_date).toLocaleDateString() : 'N/A'}</td>
                                <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}</td>
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
