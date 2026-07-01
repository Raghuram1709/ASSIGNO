# Backend Profile Management Migration Plan

This document outlines the step-by-step migration plan for implementing full Profile Management (profile details update & profile image upload) on the ASSIGNO backend, based strictly on the current architecture. 

No architectural refactoring is required. The implementation seamlessly extends the existing MVC and service-layer patterns.

---

## 1. Implementation Order

To ensure a safe and iterative integration, the features must be built from the database layer upwards:

1. **Database Schema**: Expand the Mongoose User model to support the new data fields.
2. **Service Layer**: Implement the business logic for updating the database (updating profile fields and avatar URLs).
3. **Controller Layer**: Handle the incoming HTTP requests, interface with Cloudinary for file uploads, and call the service methods.
4. **Routing Layer**: Expose the new endpoints and protect them using the existing `authMiddleware` and `uploadMiddleware`.

---

## 2. Database Schema Changes

**File**: `src/models/user.js`

**Why it must change**: 
The current User model only stores `name`, `email`, and `password`. The frontend `ProfileInformation` and `ProfileCard` components rely on numerous other fields that must be persisted to the database.

**Exact Modifications**:
Expand `userSchema` to include the following fields (all of type `String` and `required: false` unless otherwise noted):
- `avatarUrl`: URL string pointing to the uploaded Cloudinary image.
- `phone`: User's phone number.
- `bio`: Short biography (with an optional Mongoose `maxlength: 300` validation).
- `department`: E.g., "Computer Science".
- `role`: E.g., "Developer".
- `studentId`: Identifier string.
- `year`: E.g., "Junior".
- `organization`: E.g., "Tech Club".
- `location`: E.g., "New York, USA".

*Note: Existing user documents in MongoDB will naturally remain valid, they will simply lack these fields until a profile update occurs.*

---

## 3. Service Layer Changes

**File**: `src/services/authservice.js`

**Why it must change**:
The backend heavily abstracts logic into the service layer. Controllers should not interact with Mongoose directly. We need new service methods to handle profile mutations.

**Exact Modifications**:
1. Add `updateProfile(userId, profileData)`:
   - Uses `User.findByIdAndUpdate` to update the user with the provided `profileData`.
   - Ensure the updated user object is returned, stripping the `password` field via `.select("-password")`.
   - Throw a 404 `AppError` if the user is not found.
2. Add `updateProfileImage(userId, imageUrl)`:
   - Finds the user by ID and updates only the `avatarUrl` field.
   - Throws a 404 `AppError` if not found.
3. Add `removeProfileImage(userId)` (Optional but recommended):
   - Sets the `avatarUrl` to `null`.
4. Export these new functions at the bottom of the file alongside `login`, `signUp`, and `getCurrentUser`.

---

## 4. Controller Layer Changes

**File**: `src/controllers/authController.js`

**Why it must change**:
Controllers are required to parse incoming requests, trigger file uploads, handle service calls, and construct HTTP JSON responses.

**Exact Modifications**:
1. Add `updateUserProfile` controller:
   - Extracts the authenticated user's ID from `req.user.id`.
   - Extracts the updated fields from `req.body`.
   - Calls `authservice.updateProfile(req.user.id, req.body)`.
   - Returns a `200 OK` response with the updated user data.
2. Add `uploadProfileImage` controller:
   - Extracts `req.user.id`.
   - Checks if `req.file` exists (populated by Multer). If not, throw a 400 error.
   - Uploads `req.file.path` to Cloudinary using the existing credentials (e.g., `cloudinary.v2.uploader.upload`).
   - Calls `authservice.updateProfileImage(req.user.id, cloudinaryResponse.secure_url)`.
   - Returns a `200 OK` response with the new `avatarUrl`.
3. Export these new controllers.

*Note: You may optionally add a `deleteProfileImage` controller that removes the image from Cloudinary and clears the URL via `authservice`.*

---

## 5. Routing Layer Changes

**File**: `src/routes/authRoutes.js`

**Why it must change**:
The new controller functions must be bound to HTTP endpoints so the frontend can consume them. They must also be secured to ensure only the authenticated user can update their own profile.

**Exact Modifications**:
1. **Imports**: 
   - Import the new `updateUserProfile` and `uploadProfileImage` from `../controllers/authController.js`.
   - Import `upload` from `../middleware/uploadMiddleware.js`.
2. **Endpoints**:
   - Add `router.put('/me', authMiddleware, updateUserProfile);`
   - Add `router.post('/image', authMiddleware, upload.single('profileImage'), uploadProfileImage);`
   - (Optional) Add `router.delete('/image', authMiddleware, deleteProfileImage);`

By placing `authMiddleware` before the controllers, we ensure that `req.user` is reliably populated and the endpoints remain secure. The `upload.single('profileImage')` middleware ensures Multer processes the incoming FormData exactly as the frontend sends it.
