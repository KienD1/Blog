import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import ToastNotification from '../components/ToastNotification';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('public');
    const [type, setType] = useState('technology');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const navigate = useNavigate();

    const handleAddPost = async (e) => {
        e.preventDefault();
        savePost();
    };

    const savePost = async () => {
        try {
            const token = localStorage.getItem('token');
            const postData = { title, content, status, type };
            await createPost(token, postData);
            showToastMessage('Post created successfully!', 'success');
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            showToastMessage('Failed to create post. Please try again.', 'error');
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    return (
        <div className="container my-4">
            <h2>Add New Post</h2>
            <form onSubmit={handleAddPost}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="mb-3"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Type</label>
                    <input
                        type="text"
                        className="form-control"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Post</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
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

export default AddPost;
