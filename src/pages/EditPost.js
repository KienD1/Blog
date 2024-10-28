import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePostById } from '../services/api';
import ToastNotification from '../components/ToastNotification';
import { storage } from '../firebase'; // Giả sử bạn đang dùng Firebase để lưu trữ ảnh
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const EditPost = () => {
    const { postId } = useParams(); 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('public');
    const [type, setType] = useState('technology');
    const [image, setImage] = useState(''); // Thêm state cho image
    const [imageFile, setImageFile] = useState(null);
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
                setImage(post.image || ''); // Lấy URL của ảnh nếu có
            } catch (err) {
                showToastMessage('Failed to fetch post data. Please try again.', 'error');
            }
        };

        fetchPost();
    }, [postId]);

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleEditPost = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (imageFile) {
                // Upload ảnh nếu có ảnh mới được chọn
                const storageRef = ref(storage, `images/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Progress function (if needed)
                    },
                    (error) => {
                        showToastMessage(`Failed to upload image: ${error.message}`, 'error');
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        savePost(downloadURL);
                    }
                );
            } else {
                savePost(image); // Nếu không có ảnh mới, dùng ảnh cũ
            }
        } catch (err) {
            showToastMessage('Failed to update post. Please try again.', 'error');
        }
    };

    const savePost = async (imageUrl) => {
        try {
            const token = localStorage.getItem('token');
            const updatedPost = { title, content, status, type, image: imageUrl };
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
                    {image && (
                        <div className="mt-3">
                            <img src={image} alt="Post" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Update Post</button>
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
