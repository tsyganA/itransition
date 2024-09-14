// src/components/RegisterButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/register');
    };

    return <button onClick={handleClick}>Register</button>;
};

export default RegisterButton;
