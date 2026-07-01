import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

  projectCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  company: {
    type: String
  },

  deadline: {
    type: Date
  },

  progress: {
    type: Number,
    default: 0
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });


projectSchema.index(
  { title: 1, createdBy: 1 },
  { unique: true }
);

const Project =
    mongoose.models.Project ||
    mongoose.model("Project", projectSchema);

export default Project;