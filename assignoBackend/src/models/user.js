import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, default: "", trim: true },
    
    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },

    phone: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    department: { type: String, default: "" },
    studentId: { type: String, default: "" },
    year: { type: String, default: "" },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    role: { type: String, default: "member" }
  },
  {
    timestamps: true
  }
);

const User = 
mongoose.models.User ||
mongoose.model(
    "User",
    userSchema
);

export default User;