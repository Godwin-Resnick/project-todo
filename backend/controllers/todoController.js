const Todo = require('../models/Todo');
const Project = require('../models/Project');

// Get todos by project ID
exports.getTodosByProjectId = async (req, res) => {
    const { projectId } = req.params;

    try {
        const todos = await Todo.find({ project: projectId }); // Updated field to 'project'
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a new todo to a project
exports.addTodo = async (req, res) => {
    const { description } = req.body;
    const { projectId } = req.params;

    if (!description || !projectId) {
        return res.status(400).json({ message: 'Description and projectId are required' });
    }

    try {
        const newTodo = new Todo({
            description,
            project: projectId,
            createdDate: new Date(),
            status: 'pending'
        });

        await newTodo.save();

        await Project.findByIdAndUpdate(
            projectId,
            { $push: { todos: newTodo._id } },
            { new: true }
        );

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Update a todo
exports.updateTodo = async (req, res) => {
    const { description, status } = req.body;
    const { todoId } = req.params;

    if (!description && !status) {
        return res.status(400).json({ message: 'At least one field (description or status) is required to update' });
    }

    try {
        const updateFields = { updatedDate: new Date() };
        if (description) updateFields.description = description;
        if (status !== undefined) updateFields.status = status;

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateFields, { new: true });

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    const { todoId } = req.params;

    try {
        const todo = await Todo.findByIdAndDelete(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Project.findByIdAndUpdate(todo.project, { $pull: { todos: todoId } });

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Toggle a todo's status
exports.toggleTodoStatus = async (req, res) => {
    const { todoId } = req.params;

    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.status = todo.status === 'completed' ? 'pending' : 'completed';
        todo.updatedDate = new Date();

        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};
