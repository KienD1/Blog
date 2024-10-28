import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ToastNotification from '../components/ToastNotification';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('public');
    const [type, setType] = useState('technology');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddPost = async (e) => {
        e.preventDefault();
        try {
            if (imageFile) {
                const storageRef = ref(storage, `images/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // Progress function (if you want to show progress)
                    }, 
                    (error) => {
                        showToastMessage(`Failed to upload image: ${error.message}`, 'error');
                    }, 
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setImageUrl(downloadURL);
                        savePost(downloadURL);
                    }
                );
            } else {
                savePost('');
            }
        } catch (err) {
            showToastMessage(`Failed to create post: ${err.message}`, 'error');
        }
    };
    
    const savePost = async (imageUrl) => {
        try {
            const token = localStorage.getItem('token');
            const postData = { title, content, status, type, image: imageUrl };
            await createPost(token, postData);
            showToastMessage('Post created successfully!', 'success');
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            showToastMessage('Failed to create post. Please try again.', 'error');
        }
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
                    <textarea 
                        className="form-control" 
                        rows="5" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    ></textarea>
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
                <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Post</button>
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
