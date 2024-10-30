const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    todos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo'
    }]
});

module.exports = mongoose.model('Project', ProjectSchema)