import {
  createCommunicationAPI,
} from "./communicationAPI";

export const createCommunication =
  data =>
  async () => {

    try {

      return await createCommunicationAPI(
        data
      );

    } catch (error) {

      throw error;

    }
};