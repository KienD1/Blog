import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/users/get-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAvatar(response.data.image || 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg');
            } catch (err) {
                console.error('Failed to fetch user profile');
                setAvatar('https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg'); 
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-lg">
            <div className="container">
                <Link className="navbar-brand" to="/home">Blog</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item ">
                            <img
                                src={avatar}
                                alt="User Avatar"
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', cursor: 'pointer', marginLeft: '15px' }}
                                onClick={handleProfileClick}
                            />
                        </li>
                        <li className="nav-item ms-3">
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
