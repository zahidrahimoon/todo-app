import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Note the plural 'timestamps'
  }
);

// Check if the model already exists in mongoose.models
const TodoModel = mongoose.models.todo || mongoose.model('todo', schema);

export default TodoModel;
