import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaThumbsUp } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
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
                    image: response.data.image || 'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg'
                });
            } catch (err) {
                showToastMessage('Failed to fetch profile information. Please try again.', 'error');
            }
        };

        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const posts = response.data.filter(post => post.username === profile.username);

                const postsWithLikes = await Promise.all(
                    posts.map(async post => {
                        const likesResponse = await axios.get(`http://localhost:3000/posts/${post.id}/likes`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        return { ...post, likes: likesResponse.data.length };
                    })
                );

                setUserPosts(postsWithLikes);
            } catch (err) {
                showToastMessage('Failed to fetch user posts. Please try again.', 'error');
            }
        };

        fetchUserProfile().then(fetchUserPosts); 
    }, [profile.username]);

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div className="container my-4">
            <div className="d-flex align-items-center my-2">
                <button type="button" className="btn btn-secondary me-auto" onClick={handleBack}>Back</button>
                <h2 className="flex-grow-1 text-center m-0">Profile Information</h2>
            </div>


            <div className="card mb-4 p-4 d-flex justify-content-start align-items-center shadow-sm">
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

            <div className='flex text-center'><h2>My Posts</h2></div>
            <div className="mt-4">
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <div key={post.id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <div
                                        className="card-text"
                                        dangerouslySetInnerHTML={{ __html: post.content.substring(0, 10000) }}
                                    />
                                <p className="card-text">
                                    <small className="text-muted">Created at: {new Date(post.createAt).toLocaleDateString()}</small>
                                </p>
                                <div className="d-flex align-items-center">
                                    <FaThumbsUp style={{ color: 'blue', marginRight: '8px' }} />
                                    <span>{post.likes} Likes</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
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
