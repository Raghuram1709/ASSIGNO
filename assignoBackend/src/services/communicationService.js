import Project
from "../models/project.js";

import Member
from "../models/member.js";

import AppError
from "../utils/appError.js";

import {
  createNotification,
} from "./notificationService.js";

export const createCommunicationService = async ({
    projectCode,
    scope,
    recipientId,
    message,
    leadId,
  }) => {

    const project =
      await Project.findOne({
        projectCode,
      });

    if (!project) {
      throw new AppError(
        "Project not found",
        404
      );
    }

    if (
      project.createdBy.toString() !==
      leadId.toString()
    ) {
      throw new AppError(
        "Unauthorized",
        401
      );
    }

    if (
      scope === "project"
    ) {

      const members =
        await Member.find({
          project:
            project._id,
        });

      await Promise.all(
        members
          .filter(
            member =>
              member.user.toString() !==
              leadId.toString()
          )
          .map(
            member =>
              createNotification({
                projectId:
                  project._id,

                recipientId:
                  member.user,

                type:
                  "project_message",

                message,
              })
          )
      );

      return {
        success: true,
      };
    }

    if (
      scope === "member"
    ) {
        const member = await Member.findOne({
                project:
                project._id,

                user:
                recipientId,
            });

            if (!member) {
                throw new AppError(
                    "Member not found in project",
                    404
            );
        }



      await createNotification({
        projectId:
          project._id,

        recipientId,

        type:
          "member_message",

        message,
      });

      return {
        success: true,
      };
    }

    throw new AppError(
      "Invalid scope",
      400
    );
};