import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import EditProfile from './pages/EditProfile';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Home />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/add-post" 
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <AddPost />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/edit-post/:postId" 
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <EditPost />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/edit-profile" 
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <EditProfile />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
