import { createCommunicationService } from "../services/communicationService.js";


export const createCommunicationController =
  async (req, res, next) => {

    try {

      const communication =
        await createCommunicationService({
          projectCode:
            req.body.projectCode,

          scope:
            req.body.scope,

          recipientId:
            req.body.recipientId,

          message:
            req.body.message,

          leadId:
            req.user.id,
        });

      return res.status(201).json({
        success: true,
        communication,
      });

    } catch (error) {

      next(error);

    }
};