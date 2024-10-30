import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import ProjectForm from './ProjectForm';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Fixed template literal
      });
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching projects. Please login');
    }
  }, []); // Empty dependency array ensures the function is stable

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProjects((prevProjects) => prevProjects.filter(project => project._id !== projectId));
      alert('Project deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the project.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div>
      <h2>Projects</h2>
      <ProjectForm fetchProjects={fetchProjects} />
      {error && <p>{error}</p>}
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>
                <Link to={`/projects/${project._id}`}>{project.title}</Link>
              </td>
              <td>
                <button onClick={() => deleteProject(project._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
