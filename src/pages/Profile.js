import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/users/get-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile({
                    ...response.data,
                    image: response.data.image || 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg' //
                });
            } catch (err) {
                showToastMessage('Failed to fetch profile information. Please try again.', 'error');
            }
        };

        fetchUserProfile();
    }, []);

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="container my-4">
            <h2>Profile Information</h2>
            <div className="card mb-4 p-4  d-flex justify-content-start align-items-center shadow-sm">
                <div className="d-flex justify-content-start align-items-center">
                    <div className="position-relative">
                        {profile.image && (
                            <img
                                src={profile.image}
                                alt="User Avatar"
                                className="rounded-circle"
                                style={{ width: '200px', height: '200px' }}
                            />
                        )}
                        <FaEdit
                            className="position-absolute"
                            style={{ top: '10px', right: '10px', cursor: 'pointer', fontSize: '1.5rem' }}
                            onClick={handleEditProfile}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <h5>Username: {profile.username}</h5>
                    <p>Date of Birth: {profile.dob}</p>
                </div>
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

export default Profile;
