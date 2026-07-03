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
      required: function() {
        return this.authProvider === 'local';
      }
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
    role: { type: String, default: "member" },
    lastLogin: { type: Date, default: null },
    currentLogin: { type: Date, default: null },

    // Verification and Auth Provider fields
    isVerified: { type: Boolean, default: true },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    otpLastSent: { type: Date, default: null },
    otpResendAttempts: { type: Number, default: 0 },
    otpVerifyAttempts: { type: Number, default: 0 },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, default: null },

    // Password Reset fields
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
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