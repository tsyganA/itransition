import React, { useEffect, useState } from 'react';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to view this page.');
            return;
        }

        fetch('/api/users', {
            headers: {
                Authorization: `Bearer ${token}`, // Добавлен префикс Bearer для токена
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => setUsers(data))
            .catch(error => setError(error.message));
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>User List</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
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

export default UsersTable;
