import { createSlice } from "@reduxjs/toolkit";
import { loadAuthToStorage, clearAuthStorage } from "./authLocalStore";

const initialState = {
    user: null,
    loading: false,
    error: null,
    token: null,
    isAuthenticated: false,
    message: null,
    emailForVerification: null,
    ...loadAuthToStorage()
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        authStart: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        authSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.message = action.payload.message;
            state.emailForVerification = null;
        },
        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            state.emailForVerification = null;
            clearAuthStorage();
        },
        setMessage: (state, action) => {
            state.message = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
            state.message = null;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        verificationRequired: (state, action) => {
            state.loading = false;
            state.emailForVerification = action.payload.email;
            state.message = action.payload.message;
            state.error = null;
        },
        clearVerificationState: (state) => {
            state.emailForVerification = null;
        }
    }
})

export const {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  clearError,
  updateUserSuccess,
  verificationRequired,
  clearVerificationState,
  setMessage
} = authSlice.actions;

export default authSlice.reducer;