// src/api.js
// Centralized Axios instance for making API requests with JWT interception.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://global-connection-1.onrender.com", // Dynamic backend URL
});

// Axios Interceptor: Automatically attach JWT for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// User & Auth API functions
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// User Profile API functions
export const createProfile = async (name, formData) => {
  try {
    const response = await api.post(`/api/users/profile/${name}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getProfile = async (profileId) => {
  try {
    const response = await api.get(`/api/users/profile/${profileId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateSkills = async (profileId, skills) => {
  try {
    const response = await api.post(`/api/users/profile/updateSkills/${profileId}`, { skills });
    return response.data;
  } catch (error) {
    console.error('Error updating skills:', error);
    throw error;
  }
};

export const updateStatus = async (profileId, newStatus) => {
  try {
    const response = await api.post(`/api/users/profile/update/status/${profileId}`, { newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export const sendConnectionRequest = async (receiverId, senderId) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/request/connection/${senderId}`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        profileId: receiverId
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error;  
  }
};

export const acceptConnection = async (accepterProfileId, requesterId) => {
  try {
    const response = await api.post(`/api/users/connection/${accepterProfileId}`, { id: requesterId });
    return response.data;
  } catch (error) {
    console.error('Error accepting connection:', error);
    throw error;
  }
};

// Post API functions
export const createPost = async (userId, formData) => {
  try {
    const response = await api.post(`/api/posts/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const response = await api.get('/api/posts/');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/api/posts/get/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/posts/delete/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/like/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });

    const data = await response.json();
    if(response.ok) {
      return data;
    } else {
      console.log('like issue');
    }
    
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Comment API functions
export const createComment = async (writerId, postId, commentData) => {
  try {
    const response = await api.post(`/api/comment/${writerId}/${postId}`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await api.get(`/api/comment/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Job API functions
export const postJob = async (userId, formData) => {
  try {
    const response = await api.post(`/api/jobs/post/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting job:', error);
    throw error;
  }
};

export const getAllJobs = async () => {
  try {
    const response = await api.get('/api/jobs/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};

export const getJobById = async (jobId) => {
  try {
    const response = await api.get(`/api/jobs/get/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw error;
  }
};

export const applyForJob = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/jobs/apply/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });

    const data = await res.json();
    if(res.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

export const searchJobs = async (query) => {
  try {
    const response = await api.get(`/api/jobs/search?${new URLSearchParams(query).toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export default api;
