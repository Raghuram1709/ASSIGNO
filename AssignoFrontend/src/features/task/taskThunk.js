import { taskStart, assignTaskSuccess,setTasks, taskFailure } from "./taskSlice";
import { assignTaskAPI, fetchTasksByProjectAPI } from "./taskAPI";

export const assignTask = ({ projectId, assignedTo, tasks, token }) => async (dispatch) => {
    console.log("Dispatching assignTask with data:", { projectId, assignedTo, tasks, token: token ? "Provided" : "Not Provided" });
    try {
        dispatch(taskStart());

        const response = await assignTaskAPI({ projectId, assignedTo, tasks, token });

        
        
        dispatch(assignTaskSuccess(response.task));

        return response.task;
    } catch (error) {
        dispatch(
            taskFailure(
                error.response?.data?.message || "Task assignment failed"
            )
        );

        throw error;
    }
};

export const fetchTasksByProject = (projectCode, token) => async (dispatch) => {
    try {
        dispatch(taskStart());
        const response = await fetchTasksByProjectAPI(projectCode, token);
        console.log("Tasks response: ",response.tasks);
        dispatch(setTasks(response.tasks));
    } catch (error) {
        dispatch(
            taskFailure(
                error.response?.data?.message || "Fetching tasks failed"
            )
        );
        throw error;
    }
};

