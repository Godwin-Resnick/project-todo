import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ProjectList from './components/Projects/ProjectList';
import ProjectView from './components/Projects/ProjectView';

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectView />} />
      </Routes>
    </div>
  );
};

export default App;
