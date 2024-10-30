import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaThumbsUp, FaTrash } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification';
import { Modal, Button } from 'react-bootstrap';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
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

    const handleEditPost = (postId) => {
        navigate(`/edit-post/${postId}`);
    };

    const handleDeletePost = (postId) => {
        setPostToDelete(postId);
        setShowModal(true);
    };

    const confirmDeletePost = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/posts/${postToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToastMessage('Post deleted successfully!', 'success');
            setUserPosts(userPosts.filter(post => post.id !== postToDelete));
        } catch (err) {
            showToastMessage('Failed to delete post. Please try again.', 'error');
        } finally {
            setShowModal(false);
            setPostToDelete(null);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setPostToDelete(null);
    };

    return (
        <div className="container my-4">
            <div className="d-flex align-items-center my-2">
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
                                <div className="d-flex text-center align-items-end mt-2 position-absolute" style={{ bottom: '10px', right: '10px' }}>
                                    <FaEdit
                                        className="text-warning me-3"
                                        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                                        onClick={() => handleEditPost(post.id)}
                                    />
                                    <FaTrash
                                        className="text-danger"
                                        style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                                        onClick={() => handleDeletePost(post.id)}
                                    />
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

            {/* Modal Confirm Delete */}
            <Modal show={showModal} onHide={closeModal} centered> 
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this post?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeletePost}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Profile;
