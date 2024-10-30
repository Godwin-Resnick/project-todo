const Project = require("../models/Project");
const Todo = require("../models/Todo");
const axios = require("axios"); // Import axios to make HTTP requests

// Get all projects for the authenticated user
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).populate("todos");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Get a single project by ID for the authenticated user
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure the project belongs to the logged-in user
    }).populate("todos");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  const { title } = req.body;
  try {
    const newProject = new Project({
      title,
      createdDate: new Date(),
      userId: req.user.id, // Corrected from 'user' to 'userId' to match schema
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

// Update a project's title for the authenticated user
exports.updateProject = async (req, res) => {
  const { title } = req.body;
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Ensure the project belongs to the logged-in user
      { title },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a project for the authenticated user
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Ensure the project belongs to the logged-in user
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove all associated todos
    await Todo.deleteMany({ project: project._id });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};





// Export project summary as a secret gist
exports.exportGist = async (req, res) => {
  try {
    // Retrieve the project, ensuring it belongs to the authenticated user, and populate todos
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure the project belongs to the logged-in user
    }).populate("todos");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Filter completed and pending todos
    const completedTodos = project.todos.filter(todo => todo.isCompleted);
    const pendingTodos = project.todos.filter(todo => !todo.isCompleted);

    // Construct markdown content for the gist
    const gistContent = `
# ${project.title}

**Summary**: ${completedTodos.length}/${project.todos.length} todos completed

## Pending
${pendingTodos.map(todo => `- [ ] ${todo.description}`).join('\n')}

## Completed
${completedTodos.map(todo => `- [x] ${todo.description}`).join('\n')}
    `;

    // Authorization: Use a personal GitHub token for creating a gist
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.error("GitHub token not found in environment variables");
      return res.status(500).json({ message: "GitHub token not configured" });
    }

    // Send request to GitHub to create the gist
    const gistResponse = await axios.post(
      "https://api.github.com/gists",
      {
        public: false,
        files: {
          [`${project.title}-summary.md`]: {
            content: gistContent,
          },
        },
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      }
    );

    // Send the gist URL in the response
    return res.json({ gistUrl: gistResponse.data.html_url });

  } catch (error) {
    console.error("Export Error:", error);
    // Only send a response if headers are not already sent
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error" });
    }
  }
};
