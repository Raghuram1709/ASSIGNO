import authservice from '../services/authservice.js';
import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/appError.js';
const loginUser = async (req, res, next) => {
    try {
        const result = await authservice.login(req.body)

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: result
        })

    } catch(err) {
        next(err)
    }
}

const signupUser = async (req, res, next) => {
    try {
        const result = await authservice.signUp(req.body);
        res.status(201).json({
            success: true,
            message: "Account created Succesfully",
            data: result
        })

    } catch(err) {
        next(err)
    }
}

const getCurrentUser = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await authservice.getCurrentUser(
                req.user.id
            );
        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            'firstName', 'lastName', 'username', 'phone', 
            'bio', 'department', 'studentId', 'year', 
            'organization', 'location', 'role'
        ];
        
        const updateData = {};
        for (const key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        }

        if (updateData.username !== undefined && updateData.username.trim() !== '') {
            const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
            if (!usernameRegex.test(updateData.username)) {
                throw new AppError("Username must be 3-30 characters long and can only contain letters, numbers, and underscores.", 400);
            }
        }

        if (updateData.phone !== undefined && updateData.phone.trim() !== '') {
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(updateData.phone)) {
                throw new AppError("Invalid phone format.", 400);
            }
        }

        if (updateData.bio !== undefined && updateData.bio.length > 300) {
            throw new AppError("Bio cannot exceed 300 characters.", 400);
        }

        const maxLengthFields = ['department', 'organization', 'location'];
        for (const field of maxLengthFields) {
            if (updateData[field] !== undefined && updateData[field].length > 100) {
                 throw new AppError(`${field} cannot exceed 100 characters.`, 400);
            }
        }

        const result = await authservice.updateProfile(req.user.id, updateData);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError("No image file provided", 400);
        }

        const currentUser = await authservice.getCurrentUser(req.user.id);
        
        if (currentUser.profileImage && currentUser.profileImage.publicId) {
            await cloudinary.uploader.destroy(currentUser.profileImage.publicId);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "assigno/profiles",
            width: 500,
            crop: "scale"
        });

        const updatedUser = await authservice.updateProfileImage(
            req.user.id, 
            result.secure_url, 
            result.public_id
        );

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            data: updatedUser
        });
    } catch (err) {
        next(err);
    }
};

const deleteProfileImage = async (req, res, next) => {
    try {
        const currentUser = await authservice.getCurrentUser(req.user.id);
        
        if (!currentUser.profileImage || !currentUser.profileImage.publicId) {
            throw new AppError("No profile image found to delete", 404);
        }

        await cloudinary.uploader.destroy(currentUser.profileImage.publicId);
        
        const updatedUser = await authservice.deleteProfileImage(req.user.id);

        res.status(200).json({
            success: true,
            message: "Profile image deleted successfully",
            data: updatedUser
        });
    } catch (err) {
        next(err);
    }
};

const getUserStatsAndActivities = async (req, res, next) => {
    try {
        const result = await authservice.getUserStatsAndActivities(req.user.id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new AppError("Please provide both current and new passwords", 400);
        }
        if (newPassword.length < 6) {
            throw new AppError("New password must be at least 6 characters long", 400);
        }
        
        const result = await authservice.changePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        next(err);
    }
};

const deleteAccount = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            throw new AppError("Password is required to delete account", 400);
        }
        
        const result = await authservice.deleteAccount(req.user.id, password);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        next(err);
    }
};

export {
    loginUser,
    signupUser,
    getCurrentUser,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage,
    getUserStatsAndActivities,
    changePassword,
    deleteAccount
};