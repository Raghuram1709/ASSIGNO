import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    loading: false,
    error: null,
    message: null
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        taskStart: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        assignTaskSuccess: (state, action) => {
            state.loading = false;

            const mappedTasks = action.payload.map(task => ({
                taskId: task._id || task.id,
                projectId: task.project || task.projectId,
                assignedTo: task.assignedTo,
                title: task.title,
                deadline: task.deadline || null,
                progress: task.progress || 0,
                status: task.status || "Pending",   
                createdAt: task.createdAt || null
            }));

            state.tasks.push(...mappedTasks);

            state.message = "Task assigned successfully";
        },

        setTasks: (state, action) => {
            state.loading = false;

            state.tasks =
                action.payload.map(task => ({
                    taskId: task._id,
                    projectId: task.project,
                    assignedTo: task.assignedTo,
                    title: task.title,
                    deadline: task.deadline,
                    progress: task.progress || 0,
                    status: task.status || "Pending",
                    createdAt: task.createdAt
                }));
            },
        
        taskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message =  null;
        },

        updateTaskStatus: (state, action) => {
                const updatedTask =
                    action.payload;

                const task =
                    state.tasks.find(
                    task =>
                        task.taskId ===
                        updatedTask._id
                    );

                if (task) {
                    task.status =
                    updatedTask.status;
                }
            },
    }
});

export const {
   taskStart,
   assignTaskSuccess,
   setTasks,
   taskFailure,
   updateTaskStatus
} = taskSlice.actions;
export default taskSlice.reducer;
