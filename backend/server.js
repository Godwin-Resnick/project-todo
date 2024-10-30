require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const config = require('./config/config');
const cors = require('cors');

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

//connect to the database
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/projects', projectRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);


app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});