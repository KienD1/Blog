import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, deletePostById, likePost, unlikePost, getLikes } from '../services/api';
import { FaThumbsUp } from 'react-icons/fa';
import ToastNotification from '../components/ToastNotification';
import { Modal, Button } from 'react-bootstrap';
import '../styles/Home.css'; 



const Home = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [likes, setLikes] = useState({});
    const [userLikedPosts, setUserLikedPosts] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await getPosts(token);
                    setPosts(response.data);
                    setFilteredPosts(response.data);
                    fetchLikes(response.data);
                } else {
                    showToastMessage('You must be logged in to view posts.', 'error');
                }
            } catch (err) {
                showToastMessage('Failed to fetch posts. Please try again later.', 'error');
            }
        };

        fetchPosts();
    }, []);

    const fetchLikes = async (posts) => {
        try {
            const token = localStorage.getItem('token');
            const likesData = {};
            const userLikes = {};
            for (const post of posts) {
                const response = await getLikes(token, post.id);
                likesData[post.id] = response.data.length;

                // Kiểm tra nếu người dùng hiện tại đã like bài viết
                const userLiked = response.data.some(like => like.username === 'current_user'); // Thay thế 'current_user' bằng giá trị thực tế
                userLikes[post.id] = userLiked;
            }
            setLikes(likesData);
            setUserLikedPosts(userLikes);
        } catch (err) {
            showToastMessage('Failed to fetch likes. Please try again later.', 'error');
        }
    };

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleAddPost = () => {
        navigate('/add-post');
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
            await deletePostById(token, postToDelete);
            showToastMessage('Post deleted successfully!', 'success');
            setPosts(posts.filter(post => post.id !== postToDelete));
            setFilteredPosts(filteredPosts.filter(post => post.id !== postToDelete));
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

    const toggleLike = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            if (userLikedPosts[postId]) {
                await unlikePost(token, postId);
                showToastMessage('Post unliked successfully!', 'success');
                updateLikes(postId, -1);
            } else {
                await likePost(token, postId);
                showToastMessage('Post liked successfully!', 'success');
                updateLikes(postId, 1);
            }
            setUserLikedPosts((prevState) => ({
                ...prevState,
                [postId]: !prevState[postId],
            }));
        } catch (err) {
            showToastMessage('Failed to update like status. Please try again.', 'error');
        }
    };

    const updateLikes = (postId, change) => {
        setLikes((prevLikes) => ({
            ...prevLikes,
            [postId]: (prevLikes[postId] || 0) + change,
        }));
    };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchTerm(keyword);

        if (keyword === '') {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(keyword) || post.content.toLowerCase().includes(keyword)
            );
            setFilteredPosts(filtered);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ maxWidth: '300px' }}
                />
                <button className="btn btn-primary" onClick={handleAddPost}>Create post</button>
            </div>
            <div className="d-flex flex-column align-items-center">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="col-md-8 mb-5 animate-slide-in">
                            <div className="card position-relative shadow-lg" style={{ width: '100%', maxWidth: '800px' }}>
                                {post.image && (
                                    <img src={post.image} className="card-img-top" alt="Post" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{post.content.substring(0, 100)}...</p>
                                    <p className="card-text">
                                        <small className="text-muted">By {post.username}</small>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">Created at: {new Date(post.createAt).toLocaleDateString()}</small>
                                    </p>
                                    <button className="btn btn-warning me-2 mt-2" onClick={() => handleEditPost(post.id)}>Edit</button>
                                    <button className="btn btn-danger mt-2" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                </div>
                                <div className="position-absolute top-0 end-0 p-2">
                                    <FaThumbsUp
                                        onClick={() => toggleLike(post.id)}
                                        style={{
                                            cursor: 'pointer',
                                            color: userLikedPosts[post.id] ? 'blue' : 'gray',
                                            fontSize: '1.5rem',
                                        }}
                                    />
                                    <span className="ms-2">{likes[post.id] || 0}</span>
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
            <Modal show={showModal} onHide={closeModal}>
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

export default Home;