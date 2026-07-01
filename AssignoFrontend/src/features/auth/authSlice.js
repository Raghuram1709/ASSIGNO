import { createSlice } from "@reduxjs/toolkit";
import { loadAuthToStorage, clearAuthStorage } from "./authLocalStore";

const initialState = {
    user: null,
    loading: false,
    error: null,
    token: null,
    isAuthenticated: false,
    message: null,
    ...loadAuthToStorage()
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        authSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token
            state.isAuthenticated = true;
             state.message = action.payload.message;
            
        },
        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            clearAuthStorage();
        },
        setMessage: (state, action) => {
            state.message = action.payload
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        }
    }
})

export const {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  updateUserSuccess
} = authSlice.actions;

export default authSlice.reducer;