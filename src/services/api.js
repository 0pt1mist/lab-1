import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPosts = () => {
  return apiClient.get('/posts?_limit=10');
};

export const createPost = (postData) => {
  return apiClient.post('/posts', postData);
};

export const updatePost = (id, postData) => {
  return apiClient.put(`/posts/${id}`, postData);
};

export const deletePost = (id) => {
  return apiClient.delete(`/posts/${id}`);
};