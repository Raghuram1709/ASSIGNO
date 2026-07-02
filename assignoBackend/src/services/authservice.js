import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from "../utils/appError.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Member from "../models/member.js";
const login = async ({email, password, rememberMe}) => {
    
        const user = await User.findOne({email});
        if(!user) {
            throw new AppError("User Not Found", 404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid Credentials", 401)
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
    const user = new User({
        name,
        email,
        password: hashedPassword
    });
    await user.save()
    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
}

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

export default { login, signUp, getCurrentUser, updateProfile, updateProfileImage, deleteProfileImage, getUserStatsAndActivities, changePassword, deleteAccount };