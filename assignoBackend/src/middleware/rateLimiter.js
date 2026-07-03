import rateLimit from "express-rate-limit";

// Overall rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for login requests
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for OTP verification and resending
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit OTP attempts to 10 per 5 minutes
  message: {
    success: false,
    message: "Too many OTP verification or resend attempts. Please try again after 5 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for forgot-password requests
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit reset link requests to 5 per 15 minutes
  message: {
    success: false,
    message: "Too many password reset requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
