import axios from 'axios';

const API_URL = 'http://localhost:3000';

const register = (data) => axios.post(`${API_URL}/register`, data);
const login = (data) => axios.post(`${API_URL}/login`, data);
const getProfile = (token) => axios.get(`${API_URL}/users/get-profile`, {
    headers: { Authorization: `Bearer ${token}` }
});
const updateProfile = (token, data) => axios.put(`${API_URL}/users/update-profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
});
const createPost = (token, data) => axios.post(`${API_URL}/posts`, data, {
    headers: { Authorization: `Bearer ${token}` }
});
const getPosts = (token) => axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
});
const getPostById = (token, id) => axios.get(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
const updatePostById = (token, id, data) => axios.put(`${API_URL}/posts/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
});
const deletePostById = (token, id) => axios.delete(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
const likePost = (token, id) => axios.post(`${API_URL}/posts/${id}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
});
const unlikePost = (token, id) => axios.post(`${API_URL}/posts/${id}/unlike`, {}, {
    headers: { Authorization: `Bearer ${token}` }
});
const getLikes = (token, id) => axios.get(`${API_URL}/posts/${id}/likes`, {
    headers: { Authorization: `Bearer ${token}` }
});

export {
    register,
    login,
    getProfile,
    updateProfile,
    createPost,
    getPosts,
    getPostById,
    updatePostById,
    deletePostById,
    likePost,
    unlikePost,
    getLikes
};
