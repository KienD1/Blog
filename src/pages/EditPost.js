import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePostById } from '../services/api';
import ToastNotification from '../components/ToastNotification';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const EditPost = () => {
    const { postId } = useParams(); 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('public');
    const [type, setType] = useState('technology');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await getPostById(token, postId);
                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setStatus(post.status);
                setType(post.type);
            } catch (err) {
                showToastMessage('Failed to fetch post data. Please try again.', 'error');
            }
        };

        fetchPost();
    }, [postId]);

    const handleEditPost = async (e) => {
        e.preventDefault();
        savePost();
    };

    const handleCancel = () => {
        navigate('/home');
    };

    const savePost = async () => {
        try {
            const token = localStorage.getItem('token');
            const updatedPost = { title, content, status, type };
            await updatePostById(token, postId, updatedPost);
            showToastMessage('Post updated successfully!', 'success');
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            showToastMessage('Failed to update post. Please try again.', 'error');
        }
    };

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    return (
        <div className="container my-4">
            <h2>Edit Post</h2>
            <form onSubmit={handleEditPost}>
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
                <button type="submit" className="btn btn-primary">Update Post</button>
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

export default EditPost;
