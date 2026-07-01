# ASSIGNO Backend Authentication Context

## 1. Project Overview

- **Backend Architecture**: The backend is structured as a RESTful API utilizing a monolithic Node.js service architecture. It follows an MVC-like pattern separated into routes, controllers, services, and models.
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB using Mongoose (v9.6.3) as the ODM.
- **Folder Structure**: Clean, modular separation of concerns containing config, controllers, middleware, models, routes, services, and utils.
- **Coding Style**: Uses modern ES Modules (`import`/`export` via `"type": "module"` in `package.json`). Asynchronous operations use `async/await` heavily. Logic is heavily abstracted into a `services` layer, keeping controllers thin.
- **Middleware Usage**: Utilizes standard middleware like `cors`, `express.json()`, custom JWT `authMiddleware` for protected routes, a centralized `errorHandler`, and `uploadMiddleware` (multer) for file handling.

---

## 2. Folder Structure

```text
assignoBackend/
    config/
        database.js
        env.js
        cloudinary.js
    controllers/
        authController.js
        communicationController.js
        memberController.js
        notificationController.js
        projectController.js
        submissionController.js
        taskController.js
    middleware/
        authMiddleware.js
        errorHandler.js
        uploadMiddleware.js
    models/
        member.js
        notification.js
        project.js
        request.js
        task.js
        tasksubmission.js
        user.js
    routes/
        authRoutes.js
        communicationRoutes.js
        memberRoutes.js
        notificationRoutes.js
        projectRoutes.js
        submissionRoutes.js
        taskRoutes.js
    services/
        authservice.js
    utils/
        appError.js
        getProjectByCode.js
        withTransactions.js
    app.js
    server.js
```

---

## 3. User Model

The current User schema (`src/models/user.js`) is minimal.

| Field Name | Type | Required | Default | Purpose | Relationships |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | None | Stores user's full name | None |
| `email` | String | Yes | None | Primary identifier for login | None |
| `password` | String | Yes | None | Stores bcrypt hashed password | None |

*Note: The schema also includes `timestamps: true` which automatically adds `createdAt` and `updatedAt` fields.*

**Missing fields that may be needed later**:
- `avatarUrl` / `profileImage` (String)
- `phone` (String)
- `bio` (String)
- `department` (String)
- `role` (String)
- `studentId` (String)
- `resetPasswordToken` (String)
- `resetPasswordExpire` (Date)
- `isEmailVerified` (Boolean)

---

## 4. Authentication Flow

**Signup Flow**
1. **Request**: Frontend sends `name`, `email`, and `password`.
2. **Controller**: `signupUser` in `authController.js` receives the request.
3. **Validation**: `authservice.signUp` checks if a user with the email already exists in the Database.
4. **Password Hashing**: `bcrypt.hash` hashes the plaintext password with 10 salt rounds.
5. **Database**: A new `User` document is instantiated and saved to MongoDB.
6. **Response**: The service returns a sanitized user object (excluding the password) to the controller, which responds with a `201` status.

**Login Flow**
1. **Request**: Frontend sends `email`, `password`, and optionally `rememberMe`.
2. **Controller**: `loginUser` in `authController.js` receives the request.
3. **Authentication**: `authservice.login` looks up the user by email in the Database.
4. **Validation**: `bcrypt.compare` verifies the provided password against the hashed database password.
5. **Token Generation**: `jwt.sign` creates a JSON Web Token containing the user's `id` and `email`. It expires in `7d` if `rememberMe` is true, otherwise `2h`.
6. **Response**: Returns a `200` status with the token and sanitized user data.

---

## 5. Authentication Middleware

**JWT Verification**
- Implemented in `src/middleware/authMiddleware.js`.
- Extracts token from the `Authorization` header (`Bearer <token>`).
- Verifies it against `process.env.JWT_SECRET` using `jsonwebtoken`.

**Protected Routes**
- Routes using `authMiddleware` require a valid JWT. If the token is missing or invalid, a `401` Unauthorized response is returned.

**How req.user is populated**
- Upon successful JWT verification, the decoded payload `{ id, email, iat, exp }` is assigned directly to `req.user`.

**Error Handling**
- Uses a `try...catch` block. If `jwt.verify` throws an error, it is caught and a `401` status with `{ message: "Invalid token" }` is sent.

**Authorization Flow**
- Currently, there is **no role-based authorization flow**. Any valid JWT grants access to all protected endpoints.

---

## 6. Controllers

All authentication controllers are located in `src/controllers/authController.js`.

### `loginUser`
- **Purpose**: Authenticates a user and issues a JWT.
- **Input**: `req.body` containing `email`, `password`, `rememberMe`.
- **Output**: JSON containing `success`, `message`, and `data` (which includes `user` and `token`).
- **Dependencies**: `authservice.login`
- **Validation**: Delegated to the service layer.

### `signupUser`
- **Purpose**: Registers a new user.
- **Input**: `req.body` containing `name`, `email`, `password`.
- **Output**: JSON containing `success`, `message`, and `data` (`user` object).
- **Dependencies**: `authservice.signUp`
- **Validation**: Delegated to the service layer.

### `getCurrentUser`
- **Purpose**: Retrieves profile data of the currently logged-in user.
- **Input**: `req.user.id` (extracted from JWT via middleware).
- **Output**: JSON containing `success` and `data` (`user` object).
- **Dependencies**: `authservice.getCurrentUser`
- **Validation**: Relies entirely on the `authMiddleware` succeeding.

---

## 7. Routes

Located in `src/routes/authRoutes.js`.

| Method | Endpoint | Controller | Protected | Purpose | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | `loginUser` | No | Authenticate user and get token | `POST /api/auth/login` |
| POST | `/api/auth/signup` | `signupUser` | No | Register a new user | `POST /api/auth/signup` |
| GET | `/api/auth/me` | `getCurrentUser` | Yes | Get the logged-in user's profile | `GET /api/auth/me` |

---

## 8. Validation

- **Current Validation**: Extremely basic. Mongoose handles enforcing `required` fields and `unique` email constraints at the database level. `authservice.js` manually checks for an existing user during signup.
- **Missing Validation**: There is no request payload validation library (e.g., Joi, Zod, or express-validator) in place at the controller level.
- **Input Sanitization**: None currently implemented. Susceptible to injection if not handled implicitly by Mongoose.
- **Password Rules**: No complexity rules (length, special characters, casing) are currently enforced.
- **Email Validation**: Mongoose relies on exact string matching. There is no Regex format validation for valid email structures.

---

## 9. Security

- **bcrypt usage**: Used in `authservice.js` with a hardcoded `10` salt rounds for hashing passwords. `bcrypt.compare` is used for login.
- **JWT implementation**: Tokens are signed symmetrically using `process.env.JWT_SECRET`. They contain user ID and email.
- **Environment variables**: Handled securely via `dotenv` (initialized in `config/env.js`).
- **Secrets**: `JWT_SECRET`, MongoDB URI, and Cloudinary keys are kept out of source code.
- **Password handling**: The plaintext password is never logged or returned. The `getCurrentUser` service correctly uses `.select("-password")` to exclude the hash from responses. The login/signup services manually construct the response object, omitting the password.
- **Current Vulnerabilities**: 
  - No rate-limiting on login/signup endpoints (vulnerable to brute force).
  - JWTs are likely stored in `localStorage` on the frontend (vulnerable to XSS).
  - No mechanism to revoke JWTs before expiration.
- **Potential Improvements**: 
  - Add `express-rate-limit`.
  - Store tokens in HttpOnly cookies instead of returning them in the JSON body.
  - Implement Joi/Zod schema validation on incoming requests.

---

## 10. Existing Utilities

- **appError.js** (`src/utils/appError.js`): A custom Error class extending the native `Error` to easily attach status codes (e.g., `throw new AppError("Message", 404)`).
- **JWT generation**: Handled directly inside `src/services/authservice.js`. Not extracted into a utility.
- **Password hashing**: Handled directly inside `src/services/authservice.js`. Not extracted into a utility.
- **Response helpers**: None. Responses are built manually in controllers.
- **Validation helpers**: None.

---

## 11. Existing Middleware

- **Authentication** (`authMiddleware.js`): Checks for `Authorization` header, splits the `Bearer` token, verifies using `jsonwebtoken`, attaches decoded payload to `req.user`. Catches failures and sends 401.
- **Error handling** (`errorHandler.js`): Global error-catching middleware. Normalizes error responses, mapping the custom `statusCode` from `AppError` to HTTP statuses.
- **Upload** (`uploadMiddleware.js`): Configures `multer` using `diskStorage` with a 10MB file size limit.
- **CORS**: Configured in `app.js` using the `cors` package, specifically allowing `origin: "http://localhost:5173"` and `credentials: true`.
- **Logging**: No custom logging middleware exists, aside from occasional `console.log` statements.

---

## 12. Environment Variables

- `PORT`: Defines the port the Express server listens on (default 5000).
- `MONGO_URI`: The connection string for the MongoDB cluster.
- `JWT_SECRET`: The secret cryptographic key used to sign and verify JSON Web Tokens.
- `CLOUDINARY_NAME`: Cloudinary account cloud name for image uploads.
- `CLOUDINARY_API_KEY`: Cloudinary API Key.
- `CLOUDINARY_API_SECRET`: Cloudinary API Secret.

---

## 13. Database Relationships

- **User Relationships**: The `User` model currently has no explicit embedded references to other models.
- **Project Relationships**: The `Project` model (`src/models/project.js`) contains a `createdBy` field, which is an `ObjectId` referencing the `"User"` collection. It also has a compound unique index on `{ title: 1, createdBy: 1 }`.
- **Other collections**: Files like `member.js`, `task.js`, and `tasksubmission.js` suggest a relational structure where Users are tied to Projects as Members, and Tasks belong to Projects/Users.

---

## 14. API Summary

| Method | Endpoint | Authentication Required | Purpose | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | No | Authenticate user and issue JWT | `{ email, password, rememberMe }` | `{ success, message, data: { user, token } }` |
| POST | `/api/auth/signup` | No | Register a new user | `{ name, email, password }` | `{ success, message, data: { user } }` |
| GET | `/api/auth/me` | Yes | Retrieve logged-in user profile | None | `{ success, data: { user } }` |

---

## 15. Current Limitations

- **Profile APIs**: Lacks a `PUT` endpoint to update user information.
- **Image Upload**: Upload middleware exists, but there is no endpoint to attach an avatar to the User model.
- **Email Verification**: Users are active immediately upon signup; no verification loop exists.
- **Google OAuth**: Completely missing.
- **Forgot Password**: No flow exists for password recovery (requires email service & token generation).
- **Refresh Tokens**: Architecture only issues single short-to-medium-lived access tokens. No refresh flow.
- **Role Permissions**: `req.user` does not track roles (e.g., Admin, User). All authenticated users are treated equally.
- **Activity Logs**: System does not track or log recent user account activity.
- **Validation**: Missing robust input validation for incoming requests.

---

## 16. Future Expansion Recommendations

Based ONLY on the current architecture, here is the safest implementation order for future features:

1. **Profile APIs (Update Profile)**
   - *Why*: Fits perfectly into the existing MVC structure. You only need to add fields to the Mongoose `user.js` schema, write an `updateUser` function in `authservice.js`, and expose `PUT /api/auth/me`.

2. **Profile Image Upload (Cloudinary)**
   - *Why*: `uploadMiddleware.js` (Multer) and `cloudinary.js` configuration already exist in the codebase. Integrating this into a `POST /api/auth/image` endpoint builds directly upon existing utilities without requiring sweeping architectural changes.

3. **Role-Based Access Control (RBAC)**
   - *Why*: Can be implemented cleanly by adding a `role` field (default: 'member') to the User schema, adding it to the JWT payload in `authservice.js`, and writing a simple `authorizeRole(roles)` middleware to compliment the existing `authMiddleware`.

4. **Input Validation Middleware (Joi/Zod)**
   - *Why*: Essential for security and data integrity. It can be added as isolated middleware before the controllers in the route files, requiring zero changes to the underlying services or models.

5. **Forgot Password / Email Verification**
   - *Why*: Requires introducing an entirely new dependency (e.g., Nodemailer/SendGrid) and adding temporary token fields (`resetPasswordToken`, `resetPasswordExpire`) to the User schema. This increases the complexity of the service layer slightly.

6. **Refresh Tokens / Session Management**
   - *Why*: Highly disruptive to the current authentication flow. It would require modifying the login response, changing how the frontend stores auth state (moving to HttpOnly cookies), and creating a new DB collection or Schema fields to blacklist/store valid refresh tokens. 

7. **Google OAuth**
   - *Why*: The most complex addition. It requires bypassing the standard `password` requirements on the User schema (requiring schema refactoring) and integrating a library like Passport.js or handling Google ID token verification manually.
