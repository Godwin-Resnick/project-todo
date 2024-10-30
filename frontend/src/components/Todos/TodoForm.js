import React, { useState } from 'react';
import axios from 'axios';
import './TodoForm.css'

const TodoForm = ({ projectId, fetchTodos }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/todos/${projectId}`, { description }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDescription('');
      fetchTodos(); // Refresh todos list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New Todo Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
