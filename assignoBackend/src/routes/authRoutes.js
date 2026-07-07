import {
    loginUser,
    signupUser,
    getCurrentUser,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage,
    getUserStatsAndActivities,
    changePassword,
    deleteAccount,
    verifyOTP,
    resendOTP,
    googleSignIn,
    forgotPassword,
    validateResetToken,
    resetPassword
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
    authLimiter,
    loginLimiter,
    otpLimiter,
    forgotPasswordLimiter
} from '../middleware/rateLimiter.js';
import { Router } from 'express';
const router = Router();

// Apply general auth rate limiter to all authentication requests
router.use(authLimiter);

// Local authentication routes
router.post('/login', loginLimiter, loginUser);
router.post('/signup', signupUser);

// Temporary test route to debug email sending issues on live servers
router.get('/test-email', async (req, res) => {
    const targetEmail = req.query.email || "test@example.com";
    try {
        const { sendVerificationOTP } = await import('../utils/email.js');
        const info = await sendVerificationOTP(targetEmail, '123456');
        res.status(200).json({ 
            success: true, 
            message: `Test email sent successfully to ${targetEmail}`, 
            info 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to send email", 
            error: error.message, 
            stack: error.stack 
        });
    }
});

// OTP Email Verification routes
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);

// Google Sign-In route
router.post('/google', googleSignIn);

// Password recovery routes
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.get('/reset-password/:token', forgotPasswordLimiter, validateResetToken);
router.post('/reset-password', forgotPasswordLimiter, resetPassword);

// Profile and secure user routes
router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateProfile);
router.post("/me/image", authMiddleware, upload.single('profileImage'), uploadProfileImage);
router.delete("/me/image", authMiddleware, deleteProfileImage);
router.get("/me/stats", authMiddleware, getUserStatsAndActivities);
router.put("/me/password", authMiddleware, changePassword);
router.delete("/me", authMiddleware, deleteAccount);

export default router;