const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    description:
      { type: String,
        required: true 
      },
    status:
      { type: String,
        enum: ['pending', 'completed'],
        default: 'pending' 
      },
    createdDate:
      { type: Date,
        default: Date.now 
      },
    updatedDate: { type: Date },
    project:
      { type: mongoose.Schema.Types.ObjectId,
        ref: 'Project' }
});

module.exports = mongoose.model('Todo', TodoSchema);
