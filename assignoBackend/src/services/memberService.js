import User from "../models/User.js";
import Member from "../models/Member.js";
import AppError from "../utils/AppError.js";
import { getProjectByCode } from "../utils/getProjectByCode.js";
import { createNotification } from "./notificationService.js";

export const addMembersService =
async ({ projectCode, membersData }) => {

   const project =
     await getProjectByCode(
       projectCode
     );

   const createdMembers = [];

   for (const member of membersData) {

      const existingUser =
        await User.findOne({
          email: member.email
        });

      if (!existingUser) {

         throw new AppError(
            `User with email ${member.email} not found`,
            404
         );
      }

      if (
        existingUser._id.equals(
          project.createdBy
        )
      ) {

         throw new AppError(
            "Project creator cannot be added as a member",
            400
         );
      }

      const alreadyMember =
        await Member.findOne({
          project: project._id,
          user: existingUser._id
        });

      if (alreadyMember) {
         continue;
      }

      const createdMember =
        await Member.create({
          project: project._id,
          user: existingUser._id,
          role: member.role
        });

      createdMembers.push(
        createdMember
      );

      /*
      Personal notification
      */

      await createNotification({
        projectId:
          project._id,

        recipientId:
          existingUser._id,

        type:
          "member_added",

        message:
          `You have been added to ${project.title}`
      });

      /*
      Team notification
      */

      const projectMembers =
        await Member.find({
          project: project._id
        })
        .populate(
          "user",
          "name"
        );

      await Promise.all(
        projectMembers
          .filter(
            projectMember =>
              projectMember.user._id.toString() !==
              existingUser._id.toString()
          )
          .map(
            projectMember =>
              createNotification({
                projectId:
                  project._id,

                recipientId:
                  projectMember.user._id,

                type:
                  "team_update",

                message:
                  `${existingUser.name} joined the project`
              })
          )
      );
   }

   return createdMembers;
};

export const getProjectMembersService =
async (projectCode) => {
   const project = await getProjectByCode(projectCode);

   const members = await Member.find({ project: project._id })
      .populate("user", "email name");

   return members;
}