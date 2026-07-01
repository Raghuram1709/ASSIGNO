import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      project: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "task_assigned",
          "task_submitted",
          "submission_approved",
          "submission_rejected",
          "project_message",
          "member_message",
          "deadline_reminder",
           "team_update",
          "member_added"
        ],
        required: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      isRead: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

notificationSchema.index({
  recipient: 1,
});

notificationSchema.index({
  project: 1,
});

notificationSchema.index({
  isRead: 1,
});

const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;