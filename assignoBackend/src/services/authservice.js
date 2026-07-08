import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import AppError from "../utils/appError.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Member from "../models/member.js";
import { sendVerificationOTP, sendPasswordResetEmail } from "../utils/email.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async ({email, password, rememberMe}) => {
    
        const user = await User.findOne({email});
        if(!user) {
            throw new AppError("User Not Found", 404);
        }

        // Prevent Google accounts from logging in with password unless they set one
        if (user.authProvider === 'google' && !user.password) {
            throw new AppError("Please use 'Continue with Google' to sign in.", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid Credentials", 401)
        }

        // Prevent login for unverified accounts
        if (!user.isVerified) {
            throw new AppError("Please verify your email address first.", 403);
        }

        // Track current vs last login timestamps
        if (user.currentLogin) {
            user.lastLogin = user.currentLogin;
        }
        user.currentLogin = new Date();
        await user.save();

        const token = jwt.sign({
                id: user._id,  email:user.email
            },process.env.JWT_SECRET,
            {
                expiresIn:rememberMe ? "7d" : "2h"
            }
        );
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                department: user.department,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            },
            token
        };
    
};

const signUp = async ({name, email, password}) => {
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new AppError('User already exists',409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');

    const user = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        otp: hashedOtp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
        otpLastSent: new Date(),
        otpResendAttempts: 0,
        otpVerifyAttempts: 0,
        authProvider: 'local'
    });

    await user.save();

    // Send verification email (non-blocking)
    sendVerificationOTP(email, otpCode).catch((err) => {
        console.error("Failed to send signup OTP email in background:", err);
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: false
    };
};

const verifyOTP = async ({ email, otp }) => {
    if (!email || !otp) {
        throw new AppError("Email and OTP are required.", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
        throw new AppError("Email is already verified", 400);
    }

    // Increment verification attempts
    user.otpVerifyAttempts += 1;

    // Check limit
    if (user.otpVerifyAttempts > 5) {
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        throw new AppError("Too many verification attempts. This OTP has been invalidated. Please request a new one.", 400);
    }

    // Check expiration
    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
        await user.save();
        throw new AppError("OTP has expired or is invalid. Please request a new one.", 400);
    }

    // Compare OTP
    const hashedInputOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    if (hashedInputOtp !== user.otp) {
        await user.save();
        throw new AppError("Invalid verification code. Please check and try again.", 400);
    }

    // Success! Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.otpResendAttempts = 0;
    user.otpVerifyAttempts = 0;
    
    // Set login dates
    user.currentLogin = new Date();
    await user.save();

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            department: user.department,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        },
        token
    };
};

const resendOTP = async ({ email }) => {
    if (!email) {
        throw new AppError("Email is required.", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
        throw new AppError("Email is already verified", 400);
    }

    // Check 60 seconds delay
    const now = new Date();
    if (user.otpLastSent && (now - user.otpLastSent < 60 * 1000)) {
        const secondsLeft = Math.ceil(60 - (now - user.otpLastSent) / 1000);
        throw new AppError(`Please wait ${secondsLeft} seconds before requesting a new OTP.`, 400);
    }

    // Check maximum resend attempts (3 within validity window)
    // We check if the previous OTP is still valid (based on expiry). If expired, we reset attempts.
    const isOtpActive = user.otpExpires && user.otpExpires > now;
    if (isOtpActive && user.otpResendAttempts >= 3) {
        throw new AppError("Maximum resend attempts reached. Please wait for the current OTP window to expire (5 mins) before trying again.", 400);
    }

    // Reset attempts if OTP was expired
    if (!isOtpActive) {
        user.otpResendAttempts = 0;
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(newOtp).digest('hex');

    // Invalidate old one, update properties
    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
    user.otpLastSent = now;
    user.otpResendAttempts += 1;
    user.otpVerifyAttempts = 0; // Reset verification attempts for new OTP

    await user.save();

    // Send email (non-blocking)
    sendVerificationOTP(email, newOtp).catch((err) => {
        console.error("Failed to resend OTP email in background:", err);
    });

    return { message: "Verification code sent successfully." };
};

const googleSignIn = async ({ idToken, mode }) => {
    if (!idToken) {
        throw new AppError("Google ID token is required.", 400);
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
    } catch (error) {
        console.error("Google verify token error:", error);
        throw new AppError("Invalid Google credential token.", 401);
    }

    const { sub: googleId, email, name, picture } = payload;
    if (!email) {
        throw new AppError("Google account has no email address.", 400);
    }

    let user = await User.findOne({ email });

    if (user) {
        if (mode === 'signup') {
            throw new AppError("An account with this email already exists. Please log in instead.", 409);
        }
        // Link Google provider info if not already linked
        let modified = false;
        if (user.authProvider !== 'google') {
            user.authProvider = 'google';
            modified = true;
        }
        if (!user.googleId) {
            user.googleId = googleId;
            modified = true;
        }
        if (!user.isVerified) {
            user.isVerified = true; // Google accounts are pre-verified
            modified = true;
        }
        if (modified || user.isModified()) {
            await user.save();
        }
    } else {
        // Create a new Google user
        // Pass conditionally not required, so we don't supply password field.
        user = new User({
            name: name || email.split('@')[0],
            email,
            isVerified: true,
            authProvider: 'google',
            googleId,
            profileImage: {
                url: picture || "",
                publicId: ""
            }
        });
        await user.save();
    }

    // Set login dates
    if (user.currentLogin) {
        user.lastLogin = user.currentLogin;
    }
    user.currentLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            department: user.department,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        },
        token
    };
};

const forgotPassword = async ({ email }) => {
    if (!email) {
        throw new AppError("Email is required.", 400);
    }

    const user = await User.findOne({ email });
    
    // Prevent User Enumeration: if user is not found, return successful message anyway!
    if (!user) {
        return { message: "If that email address exists in our database, we have sent a password reset link." };
    }

    // Generate single-use password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
    await user.save();

    // Send email
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
    
    // Send email (non-blocking)
    sendPasswordResetEmail(user.email, resetLink).catch((err) => {
        console.error("Failed to send password reset email in background:", err);
    });

    return { message: "If that email address exists in our database, we have sent a password reset link." };
};

const validateResetToken = async ({ token }) => {
    if (!token) {
        throw new AppError("Token is required.", 400);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
        throw new AppError("Invalid or expired password reset token.", 400);
    }

    return { message: "Token is valid." };
};

const resetPassword = async ({ token, password }) => {
    if (!token || !password) {
        throw new AppError("Token and password are required.", 400);
    }

    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters long.", 400);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
        throw new AppError("Invalid or expired password reset token.", 400);
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    
    // Invalidate reset tokens
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    // Switch to local provider if they are setting a password, but keep google if linked
    if (user.authProvider === 'google' && !user.password) {
        user.authProvider = 'local';
    }

    await user.save();

    return { message: "Password updated successfully." };
};

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId)
        .select("-password");

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }
    const userObj = user.toObject();
    userObj.id = userObj._id;
    return userObj;
};
const updateProfile = async (userId, profileData) => {
    const user = await User.findByIdAndUpdate(userId, profileData, {
        new: true,
        runValidators: true
    }).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }
    const userObj = user.toObject();
    userObj.id = userObj._id;
    return userObj;
};

const updateProfileImage = async (userId, imageUrl, publicId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    
    user.profileImage = {
        url: imageUrl,
        publicId: publicId
    };
    
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    userObj.id = userObj._id;
    return userObj;
};

const deleteProfileImage = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    
    user.profileImage = {
        url: "",
        publicId: ""
    };
    
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    userObj.id = userObj._id;
    return userObj;
};

const getUserStatsAndActivities = async (userId) => {
    // Stats
    const projectsCreated = await Project.countDocuments({ createdBy: userId });
    const projectsJoined = await Member.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "completed" });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: "completed" } });
    
    // Total members in workspaces user is part of (approximation: count members in projects user joined)
    const userMemberships = await Member.find({ user: userId }).select("project");
    const projectIds = userMemberships.map(m => m.project);
    const workspaceMembersCount = await Member.countDocuments({ project: { $in: projectIds } });

    const stats = [
        { id: 1, title: 'Projects Created', value: projectsCreated.toString() },
        { id: 2, title: 'Projects Joined', value: projectsJoined.toString() },
        { id: 3, title: 'Completed Tasks', value: completedTasks.toString() },
        { id: 4, title: 'Pending Tasks', value: pendingTasks.toString() },
        { id: 5, title: 'Workspace Members', value: workspaceMembersCount.toString() },
        { id: 6, title: 'Achievements', value: '0' },
        { id: 7, title: 'Files Uploaded', value: '0' }
    ];

    // Activities
    const recentProjects = await Project.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(3);
    const recentTasks = await Task.find({ assignedTo: userId }).sort({ updatedAt: -1 }).limit(3);
    const recentMemberships = await Member.find({ user: userId }).sort({ createdAt: -1 }).limit(3).populate('project');

    let activities = [];
    
    recentProjects.forEach(p => {
        activities.push({
            id: `proj-${p._id}`,
            title: 'Created Project',
            description: `You created "${p.title}"`,
            time: p.createdAt,
            type: 'project'
        });
    });

    recentTasks.forEach(t => {
        const isCompleted = t.status === 'completed';
        activities.push({
            id: `task-${t._id}`,
            title: isCompleted ? 'Completed Task' : 'Assigned Task',
            description: isCompleted ? `Marked "${t.title}" as done` : `Assigned to "${t.title}"`,
            time: t.updatedAt,
            type: isCompleted ? 'task_completed' : 'task_assigned'
        });
    });

    recentMemberships.forEach(m => {
        if (m.project) {
            activities.push({
                id: `mem-${m._id}`,
                title: 'Joined Project',
                description: `You joined "${m.project.title}"`,
                time: m.createdAt,
                type: 'joined'
            });
        }
    });

    // Sort all activities by time descending and take top 6
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities = activities.slice(0, 6).map(act => {
        // Format time simply as date string for now or use a library later
        const dateObj = new Date(act.time);
        return {
            ...act,
            time: dateObj.toLocaleDateString()
        };
    });

    return { stats, activities };
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new AppError("Current password is incorrect", 401);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password updated successfully" };
};

const deleteAccount = async (userId, password) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Password is incorrect", 401);
    }

    // Delete associated data
    await Project.deleteMany({ createdBy: userId });
    await Task.deleteMany({ assignedTo: userId });
    await Member.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    return { message: "Account deleted successfully" };
};

export default { login, signUp, verifyOTP, resendOTP, googleSignIn, forgotPassword, validateResetToken, resetPassword, getCurrentUser, updateProfile, updateProfileImage, deleteProfileImage, getUserStatsAndActivities, changePassword, deleteAccount };