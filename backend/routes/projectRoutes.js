
const express = require('express');
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all projects
router.get('/', auth, projectController.getAllProjects);

// Get a single project by ID
router.get('/:id', auth, projectController.getProjectById);

// Create a new project
router.post('/', auth, projectController.createProject);

// Update a project title
router.put('/:id', auth, projectController.updateProject);

// Delete a project
router.delete('/:id', auth, projectController.deleteProject);

// export as a gist
router.get('/:id/export', auth, projectController.exportGist);

module.exports = router;
