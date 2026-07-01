import {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  updateUserSuccess
} from "./authSlice";

import {
  signupAPI,
  loginAPI,
  getCurrentUserAPI,
  updateProfileAPI,
  uploadProfileImageAPI,
  deleteProfileImageAPI
} from "./authAPI";

import { saveAuthToStorage } from "./authLocalStore";

export const signupUser = (userData) => async (dispatch) => {
    dispatch(authStart());

    try {
        const response = await signupAPI(userData);


        dispatch(authSuccess({
            ...response.data,
            message: response.message
        }));
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Signup Failed"
            )
        );
    }
};

export const loginUser = (userData) => async (dispatch) => {

    dispatch(authStart());

    try {
        const response = await loginAPI(userData);


        saveAuthToStorage(
            response.data.token,
            userData.rememberMe
        );

        dispatch(authSuccess({
            ...response.data,
            message:response.message,
            rememberMe:
            userData.rememberMe
        }));
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Login Failed"
            )
        );
    }
};

export const fetchCurrentUser =
(token) => async (dispatch) => {
    
    dispatch(authStart());

    try {
        console.log("2");
        const response =
            await getCurrentUserAPI(
                token
            );
        
        

        dispatch(
            authSuccess({
                user: response.data,
                token
            })
        );

    } catch (error) {

        dispatch(
            authFailure(
                error.response?.data
                    ?.message ||
                "Failed to load user"
            )
        );
    }
};

export const updateUserProfile = (userData) => async (dispatch, getState) => {
    dispatch(authStart());
    try {
        const token = getState().auth.token;
        const response = await updateProfileAPI(token, userData);
        dispatch(updateUserSuccess(response.data));
    } catch (error) {
        dispatch(authFailure(error.response?.data?.message || "Failed to update profile"));
    }
};

export const uploadUserImage = (formData) => async (dispatch, getState) => {
    dispatch(authStart());
    try {
        const token = getState().auth.token;
        const response = await uploadProfileImageAPI(token, formData);
        dispatch(updateUserSuccess(response.data));
    } catch (error) {
        dispatch(authFailure(error.response?.data?.message || "Failed to upload image"));
    }
};

export const deleteUserImage = () => async (dispatch, getState) => {
    dispatch(authStart());
    try {
        const token = getState().auth.token;
        const response = await deleteProfileImageAPI(token);
        dispatch(updateUserSuccess(response.data));
    } catch (error) {
        dispatch(authFailure(error.response?.data?.message || "Failed to delete image"));
    }
};
