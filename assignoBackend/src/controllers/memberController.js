import {
   addMembersService,
   getProjectMembersService
}
from "../services/memberService.js";

export const addMembersController =
async (req, res, next) => {

   try {

      const members =
      await addMembersService({
         projectCode: req.params.projectCode,
         membersData: req.body.members
      });

      return res.status(201).json({
         success: true,
         members
      });

   } catch(error) {
      next(error);
   }
}

export const getProjectMembersController =
async (req, res, next) => {

   try {

      const members =
      await getProjectMembersService(
         req.params.projectCode
      );

      return res.status(200).json({
         success: true,
         members
      });

   } catch(error) {
      next(error);
   }
}