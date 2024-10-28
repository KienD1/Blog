import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import ToastNotification from '../components/ToastNotification';
import '../styles/Login.css';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const today = new Date().toISOString().split('T')[0];

        if (!username) {
            newErrors.username = 'Username is required.';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long.';
        } else if (!usernameRegex.test(username)) {
            newErrors.username = 'Username must not contain special characters.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        if (!dob) {
            newErrors.dob = 'Date of Birth is required.';
        } else if (dob > today) {
            newErrors.dob = 'Date of Birth cannot be in the future.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await register({ username, password, dob });
                showToastMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } catch (err) {
                showToastMessage('Registration failed. Please try again.', 'error');
            }
        } else {
            showToastMessage('Please fix the errors in the form.', 'error');
        }
    };

    const handleBack = () => {
        navigate('/login');
    };

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{
            backgroundImage: 'url("https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-may-tinh-dep-a-19-1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh'
        }}
        >
            <div className="card p-4 animate-slide-in-right" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                        />
                        {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    <button type="button" className="btn btn-secondary w-100 mt-1" onClick={handleBack}>Back to Login</button>
                </form>
            </div>
            <ToastNotification
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Register;
