import {loginUser, signupUser, getCurrentUser, updateProfile, uploadProfileImage, deleteProfileImage, getUserStatsAndActivities, changePassword, deleteAccount} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { Router } from 'express';
const router = Router();


router.post('/login', loginUser);

router.post('/signup', signupUser );

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateProfile);
router.post("/me/image", authMiddleware, upload.single('profileImage'), uploadProfileImage);
router.delete("/me/image", authMiddleware, deleteProfileImage);
router.get("/me/stats", authMiddleware, getUserStatsAndActivities);
router.put("/me/password", authMiddleware, changePassword);
router.delete("/me", authMiddleware, deleteAccount);
export default router;