import axiosInstance from "../../services/axiosInstance";

export const signupAPI = async (userData) => {
    const response = await axiosInstance.post(
        "auth/signup",
        userData
    );

    return response.data;
}

export const loginAPI = async (userData) => {
    const response = await axiosInstance.post(
        "auth/login",
        userData
    );

    return response.data;
}


export const getCurrentUserAPI =
async (token) => {

    const response =
        await axiosInstance.get(
            "auth/me",
            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

    return response.data;
};

export const updateProfileAPI = async (token, userData) => {
    const response = await axiosInstance.patch("auth/me", userData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const uploadProfileImageAPI = async (token, formData) => {
    const response = await axiosInstance.post("auth/me/image", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteProfileImageAPI = async (token) => {
    const response = await axiosInstance.delete("auth/me/image", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getUserStatsAPI = async (token) => {
    const response = await axiosInstance.get("auth/me/stats", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const changePasswordAPI = async (token, passwords) => {
    const response = await axiosInstance.put("auth/me/password", passwords, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteAccountAPI = async (token, password) => {
    const response = await axiosInstance.delete("auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        data: { password }
    });
    return response.data;
};

export const verifyOTPAPI = async (verificationData) => {
    const response = await axiosInstance.post("auth/verify-otp", verificationData);
    return response.data;
};

export const resendOTPAPI = async (resendData) => {
    const response = await axiosInstance.post("auth/resend-otp", resendData);
    return response.data;
};

export const googleSignInAPI = async (googleData) => {
    const response = await axiosInstance.post("auth/google", googleData);
    return response.data;
};

export const forgotPasswordAPI = async (forgotData) => {
    const response = await axiosInstance.post("auth/forgot-password", forgotData);
    return response.data;
};

export const validateResetTokenAPI = async (token) => {
    const response = await axiosInstance.get(`auth/reset-password/${token}`);
    return response.data;
};

export const resetPasswordAPI = async (resetData) => {
    const response = await axiosInstance.post("auth/reset-password", resetData);
    return response.data;
};