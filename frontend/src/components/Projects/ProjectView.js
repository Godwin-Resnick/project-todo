import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TodoForm from '../Todos/TodoForm';
import TodoList from '../Todos/TodoList';
import GistExport from '../GistExport';

const ProjectView = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProject(response.data);
      setNewTitle(response.data.title);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching project.');
    }
  }, [projectId]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/todos/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  }, [projectId]);

  const updateTitle = async () => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}`, { title: newTitle }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsEditingTitle(false);
      fetchProject(); // Refresh the project details
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTodos();
  }, [fetchProject, fetchTodos]);

  return (
    <div>
      {error && <p>{error}</p>}
      {project ? (
        <div>
          {isEditingTitle ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={updateTitle}
              onKeyDown={(e) => e.key === 'Enter' && updateTitle()}
              autoFocus
            />
          ) : (
            <h2 onClick={() => setIsEditingTitle(true)}>{project.title}</h2>
          )}
          <p>{project.description}</p>
          <TodoForm projectId={projectId} fetchTodos={fetchTodos} />
          <TodoList todos={todos} fetchTodos={fetchTodos} />
          <GistExport project={project} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProjectView;
