import { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import './login.css'; 

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            console.log(credentials);
            const { data } = await login(credentials);
            const access_token = data.access_token;
            localStorage.setItem('token', access_token);
            if (access_token) {
                navigate('/activities');
            }
        } catch (error) {
            console.error('Login failed: ', error);
        }
        setCredentials({ username: '', password: '' });
    }

    const handlePasswordInput = (e) => {
        setCredentials({ ...credentials, password: e.target.value });
    };

    const handleUsernameInput = (e) => {
        setCredentials({ ...credentials, username: e.target.value });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h3 className="login-title">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleUsernameInput}
                            className="form-input"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handlePasswordInput}
                            className="form-input"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Log In</button>
                </form>
                <div className="signup-option">
                    <p>
                        Don't have an account? <a href="/" className="signup-link">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
