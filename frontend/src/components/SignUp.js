import { register } from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css'; 

export default function SignUp() {
    const [userData, setUserData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await register(userData);
            alert('Sign up successful!');
            navigate('/activities');
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    }

    function handlePassword(e) {
        setUserData({ ...userData, password: e.target.value });
    }

    function handleUsername(e) {
        setUserData({ ...userData, username: e.target.value });
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h3 className="signup-title">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userData-username">Username</label>
                        <input
                            id="userData-username"
                            name="userData-username"
                            type="text"
                            value={userData.username}
                            onChange={handleUsername}
                            className="form-input"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userData-password">Password</label>
                        <input
                            id="userData-password"
                            name="userData-password"
                            type="password"
                            value={userData.password}
                            onChange={handlePassword}
                            className="form-input"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Sign Up</button>
                </form>
                <div className="login-option">
                    <p>
                        Already have an account? <a href="/login" className="login-link">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
