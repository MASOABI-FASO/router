import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onLogin, onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); 

    // Reset error and success messages when switching between login and signup
    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
    }, [isSignUp]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (isSignUp) {
            if (users.some(user => user.username === username)) {
                setErrorMessage('Username already exists.');
            } else {
                // Call the onRegister function passed in as prop
                onRegister({ username, password });
                setSuccessMessage('Registration successful! You can now log in.');
                setUsername('');
                setPassword('');
                setTimeout(() => setIsSignUp(false), 2000);
            }
        } else {
            // Check if the user is registered
            const user = users.find(user => user.username === username);
            if (!user) {
                setErrorMessage('User not registered. Please sign up.');
            } else if (user.password !== password) {
                // Check if the password is correct
                setErrorMessage('Incorrect password.');
            } else {
                // If user exists and password matches, call the onLogin function
                onLogin(username, password, setErrorMessage, setSuccessMessage);
            }
        }
    };

    // Navigate to the dashboard if registration or login is successful
    useEffect(() => {
        if (successMessage) {
            navigate('/dashboard');
        }
    }, [successMessage, navigate]);

    return (
        <div>
            <marquee><img src="maswaby.png" alt="Cafe Logo" />
            <h3>WELCOME TO WINGS CAFE INVENTORY MANAGEMENT</h3></marquee>
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isSignUp ? 'Register' : 'Login'}</button>
            </form>
           
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

export default Auth;