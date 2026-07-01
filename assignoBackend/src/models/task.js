import mongoose from "mongoose";


const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "assigned",
        "submitted",
        "completed"
      ],
      default: "assigned",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ project: 1 });

taskSchema.index({ assignedTo: 1 });

taskSchema.index({ assignedBy: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;