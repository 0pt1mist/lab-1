import React, { useEffect, useState } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../services/api';
import './PostManager.css';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ title: '', body: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editingId) {
        const response = await updatePost(editingId, formData);
        setPosts(posts.map(post => (post.id === editingId ? response.data : post)));
        setEditingId(null); 
      } else {
        const response = await createPost(formData);
        setPosts([response.data, ...posts]);
      }
      setFormData({ title: '', body: '' });
    } catch (err) {
      setError('Ошибка при сохранении: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setFormData({ title: post.title, body: post.body });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', body: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

    setIsLoading(true);
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError('Не удалось удалить пост: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-manager">
      <h1>Управление постами</h1>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <h3>{editingId ? 'Редактировать пост' : 'Создать новый пост'}</h3>
        <input
          type="text"
          name="title"
          placeholder="Заголовок"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="body"
          placeholder="Текст поста"
          value={formData.body}
          onChange={handleInputChange}
          required
        />
        <div className="form-buttons">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : (editingId ? 'Обновить' : 'Добавить')}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Отмена
            </button>
          )}
        </div>
      </form>

      {isLoading && <div className="loader">Загрузка данных...</div>}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-content">
              <strong>#{post.id} {post.title}</strong>
              <p>{post.body}</p>
            </div>
            <div className="post-actions">
              <button 
                className="edit-btn" 
                onClick={() => handleEditClick(post)}
                disabled={isLoading}
              >
                ✎
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(post.id)}
                disabled={isLoading}
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostManager;