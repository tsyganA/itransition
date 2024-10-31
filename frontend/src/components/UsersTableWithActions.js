import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDatabase, ref, onValue, remove, set } from 'firebase/database';

const UsersTableWithActions = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null);

    const serverUrl = 'https://itransition-six.vercel.app';
    // const jwtToken =
    //     '_vercel_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVOVRHUUtxakl0QkszZ2owY3JnaHFVWXQiLCJpYXQiOjE3MzAwNjUyOTUsIm93bmVySWQiOiJ0ZWFtX2VYejhkbnlJVTZTcndRMkQ2bFNSeVR5SSIsImF1ZCI6Iml0cmFuc2l0aW9uLTQxbmg2ZjQycC1hbnRvbnMtcHJvamVjdHMtMjI5NGRhZjgudmVyY2VsLmFwcCIsInVzZXJuYW1lIjoidHN5Z2FuYSIsInN1YiI6InNzby1wcm90ZWN0aW9uIn0.AGAbfKRbOB4TOa35YWW-scytVHKj9w5xvdCeBtuCLFk';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setError('You must be logged in to view this page.');
            navigate('/login', { replace: true });
            return;
        }

        setCurrentUserId(userId);
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
                    displayName: usersData[key].displayName || 'N/A',
                    email: usersData[key].email,
                    registration_date: usersData[key].creationTime,
                    last_login: usersData[key].lastSignInTime,
                    status: usersData[key].status || 'active',
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
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
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
            for (const userId of selectedUsers) {
                const response = await axios.delete(
                    `${serverUrl}/api/deleteUser/${userId}`
                    // {
                    // headers: { Cookie: `${jwtToken}` },
                    // withCredentials: true,
                    // }
                );

                if (response.status !== 204) {
                    throw new Error('Failed to delete user from Authentication');
                }
            }

            const db = getDatabase();
            selectedUsers.forEach(async userId => {
                const userRef = ref(db, `users/${userId}`);
                await remove(userRef);
            });

            if (selectedUsers.includes(currentUserId)) {
                alert('Your account has been deleted. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            } else {
                setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                setSelectedUsers([]);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleBlock = async () => {
        if (selectedUsers.includes(currentUserId)) {
            if (!window.confirm('Are you sure you want to block your own account?')) {
                return;
            }
        }

        try {
            for (const userId of selectedUsers) {
                const response = await axios.post(
                    `${serverUrl}/api/blockUser`,
                    { uid: userId }
                    // {
                    //     headers: { Cookie: `${jwtToken}`, 'Content-Type': 'application/json' },
                    //     withCredentials: true,
                    // }
                );

                if (response.status !== 200) {
                    throw new Error('Failed to block user');
                }

                const db = getDatabase();
                const userRef = ref(db, `users/${userId}/status`);
                await set(userRef, 'blocked');
            }

            setUsers(prevUsers => prevUsers.map(user => (selectedUsers.includes(user.id) ? { ...user, status: 'blocked' } : user)));
            setSelectedUsers([]);

            if (selectedUsers.includes(currentUserId)) {
                alert('Your account has been blocked. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.reload();
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUnblock = async () => {
        try {
            for (const userId of selectedUsers) {
                const response = await axios.post(
                    `${serverUrl}/api/unblockUser`,
                    { uid: userId }
                    // {
                    //     headers: { Cookie: `${jwtToken}`, 'Content-Type': 'application/json' },
                    //     withCredentials: true,
                    // }
                );

                if (response.status !== 200) {
                    throw new Error('Failed to unblock user');
                }

                const db = getDatabase();
                const userRef = ref(db, `users/${userId}/status`);
                await set(userRef, 'active');
            }

            setUsers(prevUsers => prevUsers.map(user => (selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user)));
            setSelectedUsers([]);
        } catch (error) {
            setError(error.message);
        }
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
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    }}
                >
                    <i className="bi bi-unlock-fill" style={{ fontSize: '3rem', color: 'green' }}></i>
                </button>
                <button
                    className="btn btn-warning"
                    onClick={handleDeleteUsers}
                    disabled={selectedUsers.length === 0}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                    }}
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
