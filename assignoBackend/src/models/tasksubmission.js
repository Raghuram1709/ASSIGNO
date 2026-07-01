import mongoose from "mongoose";

const taskSubmissionSchema =
  new mongoose.Schema(
    {
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
      },

      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },
      

      note: {
        type: String,
        trim: true,
      },

      links: [
        {
          type: String,
          trim: true,
        },
      ],

      files: [
        {
          type: String,
        },
      ],

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      reviewComment: {
        type: String,
        trim: true,
      },

      reviewedAt: Date,
    },
    {
      timestamps: true,
    }
  );

taskSubmissionSchema.index({
  task: 1,
  status: 1,
});

taskSubmissionSchema.index({
  submittedBy: 1,
});

taskSubmissionSchema.index({
  createdAt: -1,
});

export default mongoose.model(
  "TaskSubmission",
  taskSubmissionSchema
);