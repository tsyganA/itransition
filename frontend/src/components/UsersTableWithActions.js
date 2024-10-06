import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDatabase, ref, onValue } from 'firebase/database';

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
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const db = getDatabase();
            const usersRef = ref(db, 'users');
            onValue(usersRef, snapshot => {
                const usersData = snapshot.val();
                const usersList = Object.keys(usersData).map(key => ({
                    id: key,
                    displayName: usersData[key].displayName || 'N/A', // Используем displayName, если оно есть
                    email: usersData[key].email,
                    registration_date: usersData[key].creationTime,
                    last_login: usersData[key].lastSignInTime,
                    status: usersData[key].status || 'active', // default status
                }));
                setUsers(usersList);
                setLoading(false);
            });
        } catch (error) {
            setError(error.message || 'Something went wrong');
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
        if (selectedUsers.includes(currentUserId)) {
            if (!window.confirm('Are you sure you want to delete your own account?')) {
                return;
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
                if (selectedUsers.includes(currentUserId)) {
                    alert('Your account has been deleted. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
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

    const updateUsersStatus = async status => {
        const token = localStorage.getItem('token');

        if (status === 'blocked' && selectedUsers.includes(currentUserId)) {
            if (!window.confirm('Are you sure you want to block your own account?')) {
                return;
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
                if (status === 'blocked' && selectedUsers.includes(currentUserId)) {
                    alert('Your account has been blocked. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
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
        updateUsersStatus('blocked');
    };

    const handleUnblock = () => {
        updateUsersStatus('active');
    };

    const formatDateTime = dateString => {
        if (!dateString) return 'Did not enter';
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString();
        const timePart = date.toLocaleTimeString();
        return `${datePart} ${timePart}`;
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
                            <th>Name (Identifier)</th>
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
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
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
