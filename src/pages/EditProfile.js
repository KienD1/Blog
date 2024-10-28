import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ToastNotification from '../components/ToastNotification';

const EditProfile = () => {
    const [dob, setDob] = useState('');
    const [image, setImage] = useState('');
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
                setDob(response.data.dob);
                setImage(response.data.image);
            } catch (err) {
                showToastMessage('Failed to fetch profile information. Please try again.', 'error');
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:3000/users/update-profile',
                { dob, image },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToastMessage('Profile updated successfully!', 'success');
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (err) {
            showToastMessage('Failed to update profile. Please try again.', 'error');
        }
    };

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    return (
        <div className="container my-4">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
            <ToastNotification
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default EditProfile;
