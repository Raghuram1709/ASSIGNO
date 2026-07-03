import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { forgotPasswordAction } from '../features/auth/authThunk';
import { clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { loading, error, message } = useAppSelector((state) => state.auth);

    // Clear error on mount
    useEffect(() => {
        dispatch(clearError());
        setIsSubmitted(false);
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            toast.success(message);
            setIsSubmitted(true);
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        dispatch(forgotPasswordAction(email));
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Forgot Password</h1>
                
                {!isSubmitted ? (
                    <>
                        <p className="auth-subtitle">
                            Enter your registered email and we'll send you a link to reset your password.
                        </p>

                        {error && <div className="auth-error-banner">{error}</div>}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    id="email"
                                    placeholder="e.g. user@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-btn" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                        <p className="auth-subtitle" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                            If <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{email}</span> exists in our system, you will receive a password reset link shortly.
                        </p>
                        <p className="auth-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Please check your inbox (and spam folder) for the reset password instructions.
                        </p>
                    </div>
                )}

                <p className="auth-footer">
                    Remember your password?
                    <button onClick={handleBackToLogin}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
