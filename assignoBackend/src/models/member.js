import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required: true
    },

    role: {
        type:String,
        enum: [
            "lead",
            "designer",
            "developer",
            "tester",
            "analyst",
            "architect"
        ],
        default:"developer"
    },

    progress: {
        type: Number,
        default: 0,
        min: 0,
        max:100
    }
}, {timestamps: true});

memberSchema.index({ project: 1, user: 1 }, { unique: true });

const Member =
    mongoose.models.Member ||
    mongoose.model("Member", memberSchema);

export default Member;