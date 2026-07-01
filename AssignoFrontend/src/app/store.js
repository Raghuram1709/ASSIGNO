import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import projectReducer from '../features/project/projectSlice.js';
import themeReducer from "../features/theme/themeSlice";
import memberReducer from '../features/member/memberSlice.js';
import taskReducer from '../features/task/taskSlice.js';
import submissionReducer from '../features/submissions/submissionSlice.js'
import notificationReducer from '../features/notifications/notificationSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        project: projectReducer,
        theme: themeReducer,
        member: memberReducer,
        task: taskReducer,
        submission: submissionReducer,
        notification: notificationReducer
    }
});
