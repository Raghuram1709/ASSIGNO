import {
  authStart,
  authSuccess,
  authFailure,
  logoutSuccess,
  updateUserSuccess,
  verificationRequired,
  setMessage
} from "./authSlice";

import {
  signupAPI,
  loginAPI,
  getCurrentUserAPI,
  updateProfileAPI,
  uploadProfileImageAPI,
  deleteProfileImageAPI,
  verifyOTPAPI,
  resendOTPAPI,
  googleSignInAPI,
  forgotPasswordAPI,
  resetPasswordAPI
} from "./authAPI";

import { saveAuthToStorage } from "./authLocalStore";

export const signupUser = (userData, navigate) => async (dispatch) => {
    dispatch(authStart());

    try {
        const response = await signupAPI(userData);

        if (response.data && response.data.isVerified === false) {
            dispatch(verificationRequired({
                email: response.data.email,
                message: "Verification code sent. Please check your email."
            }));
            if (navigate) {
                navigate('/verify-otp');
            }
        } else {
            dispatch(authSuccess({
                ...response.data,
                message: response.message
            }));
        }
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
            message: response.message,
            rememberMe: userData.rememberMe
        }));
    } catch (error) {
        // If user is unverified, store their email so they can go verify it
        if (error.response?.status === 403 && error.response?.data?.message?.includes("verify")) {
            dispatch(verificationRequired({
                email: userData.email,
                message: error.response.data.message
            }));
        }
        dispatch(
            authFailure(
                error.response?.data?.message || "Login Failed"
            )
        );
    }
};

export const verifyOtpAction = (verificationData, navigate) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await verifyOTPAPI(verificationData);
        saveAuthToStorage(
            response.data.token,
            false
        );
        dispatch(authSuccess({
            ...response.data,
            message: response.message
        }));
        if (navigate) {
            navigate('/projects');
        }
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Verification Failed"
            )
        );
    }
};

export const resendOtpAction = (resendData) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await resendOTPAPI(resendData);
        dispatch(setMessage(response.message || "Verification code resent successfully."));
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Failed to resend code"
            )
        );
    }
};

export const googleLoginAction = (idToken, navigate) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await googleSignInAPI({ idToken });
        saveAuthToStorage(
            response.data.token,
            true
        );
        dispatch(authSuccess({
            ...response.data,
            message: response.message
        }));
        if (navigate) {
            navigate('/projects');
        }
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Google sign-in failed"
            )
        );
    }
};

export const forgotPasswordAction = (email) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await forgotPasswordAPI({ email });
        dispatch(setMessage(response.message));
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Failed to send reset link"
            )
        );
    }
};

export const resetPasswordAction = (resetData, navigate) => async (dispatch) => {
    dispatch(authStart());
    try {
        const response = await resetPasswordAPI(resetData);
        dispatch(setMessage(response.message));
        if (navigate) {
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Failed to reset password"
            )
        );
    }
};

export const fetchCurrentUser = (token) => async (dispatch) => {
    dispatch(authStart());

    try {
        const response = await getCurrentUserAPI(token);

        dispatch(
            authSuccess({
                user: response.data,
                token
            })
        );
    } catch (error) {
        dispatch(
            authFailure(
                error.response?.data?.message || "Failed to load user"
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
