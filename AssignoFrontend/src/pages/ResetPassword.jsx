import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { resetPasswordAction } from '../features/auth/authThunk';
import { clearError } from '../features/auth/authSlice';
import { validateResetTokenAPI } from '../features/auth/authAPI';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    // Get token from query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [validationError, setValidationError] = useState('');

    const { loading, error, message } = useAppSelector((state) => state.auth);

    // Validate the token on mount
    useEffect(() => {
        dispatch(clearError());
        
        if (!token) {
            setValidationError("No password reset token was provided.");
            setIsValidating(false);
            return;
        }

        const validateToken = async () => {
            try {
                await validateResetTokenAPI(token);
                setIsTokenValid(true);
            } catch (err) {
                console.error("Token validation failed:", err);
                setValidationError(err.response?.data?.message || "This password reset link is invalid or has expired.");
                setIsTokenValid(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [dispatch, token]);

    // Navigate to login if password reset is successful
    useEffect(() => {
        if (message) {
            toast.success(message);
            // Redux thunk resetPasswordAction already redirects after a delay, 
            // but we can ensure navigation occurs here or within the action.
        }
    }, [message, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        dispatch(resetPasswordAction({ token, password }, navigate));
    };

    const handleRequestNew = () => {
        navigate('/forgot-password');
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    // Render States
    if (isValidating) {
        return (
            <div className="auth-page">
                <div className="auth-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="loading-spinner-wrapper">
                        <div className="auth-spinner"></div>
                    </div>
                    <p className="auth-subtitle" style={{ marginTop: '1rem' }}>
                        Verifying your reset link security...
                    </p>
                </div>
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <h1 className="auth-title">Invalid Link</h1>
                    
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <p className="auth-subtitle" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                            {validationError}
                        </p>
                        <p className="auth-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Password reset tokens are valid for single use only and expire after 15 minutes.
                        </p>
                    </div>

                    <button 
                        onClick={handleRequestNew} 
                        className="auth-btn" 
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        Request New Link
                    </button>

                    <p className="auth-footer">
                        Back to Login?
                        <button onClick={handleBackToLogin}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">
                    Please choose a strong, secure new password for your account.
                </p>

                {error && <div className="auth-error-banner">{error}</div>}
                {message && <div className="auth-success-banner" style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>{message} Redirecting to login...</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>New Password</label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading || message}>
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>

                <p className="auth-footer">
                    Change your mind?
                    <button onClick={handleBackToLogin}>
                        Cancel
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
