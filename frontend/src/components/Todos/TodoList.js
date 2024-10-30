import React, { useState } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = ({ todos, fetchTodos }) => {
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState("");

  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleStatus = async (todoId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${todoId}/status`, { status: !currentStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchTodos();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleEditClick = (todoId, description) => {
    setEditingTodoId(todoId);
    setUpdatedDescription(description);
  };

  const handleUpdate = async (todoId) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${todoId}`, 
        { description: updatedDescription }, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setEditingTodoId(null);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (todos.length === 0) {
    return <p>No todos available</p>;
  }

  return (
    <div>
      <table className="todo-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id}>
              <td>
                <input
                  type="checkbox"
                  checked={todo.status === 'completed'}
                  onChange={() => toggleStatus(todo._id, todo.status === 'completed')}
                />
              </td>
              <td>
                {editingTodoId === todo._id ? (
                  <input
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />
                ) : (
                  <span>{todo.description}</span>
                )}
              </td>
              <td>{new Date(todo.createdDate).toLocaleDateString()}</td>
              <td>
                {editingTodoId === todo._id ? (
                  <>
                    <button onClick={() => handleUpdate(todo._id)}>Save</button>
                    <button onClick={() => setEditingTodoId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(todo._id, todo.description)}>Edit</button>
                    <button onClick={() => handleDelete(todo._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
