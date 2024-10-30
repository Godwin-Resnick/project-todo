

const express = require('express');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all todos for a specific project
router.get('/:projectId', auth, todoController.getTodosByProjectId);

// Add a new todo to a project
router.post('/:projectId', auth, todoController.addTodo);

// Update a todo
router.put('/:todoId', auth, todoController.updateTodo);

// Delete a todo
router.delete('/:todoId', auth, todoController.deleteTodo);

// Toggle a todo's status (mark as complete or pending)
router.patch('/:todoId/status', auth, todoController.toggleTodoStatus);

module.exports = router;
