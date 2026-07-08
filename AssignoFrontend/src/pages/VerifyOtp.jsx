import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { verifyOtpAction, resendOtpAction } from '../features/auth/authThunk';
import { clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { emailForVerification, loading, error, message } = useAppSelector((state) => state.auth);
    
    // Get email from Redux state or query param
    const queryParams = new URLSearchParams(location.search);
    const email = emailForVerification || queryParams.get('email') || "";

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Clear errors on mount
    useEffect(() => {
        dispatch(clearError());
        if (!email) {
            toast.error("No email provided for verification. Please register or login first.");
            navigate('/signup');
        }
    }, [dispatch, email, navigate]);

    // Timer for resend cooldown
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [cooldown]);

    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(clearError());
        }
    }, [message, dispatch]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return; // Allow only numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pasteData.every(char => !isNaN(char))) {
            const newOtp = [...otp];
            pasteData.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            // Focus last input or first empty
            const focusIndex = pasteData.length < 6 ? pasteData.length : 5;
            inputRefs.current[focusIndex].focus();
        }
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }
        dispatch(verifyOtpAction({ email, otp: code }, navigate));
    };

    const handleResend = () => {
        if (!canResend) return;
        dispatch(resendOtpAction({ email }));
        setCooldown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Verify Email</h1>
                <p className="auth-subtitle">
                    We've sent a 6-digit verification code to <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{email}</span>.
                </p>
                <p className="auth-subtitle" style={{ fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                    (If you don't see it, please check your <strong>spam or junk</strong> folder.)
                </p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="otp-inputs-wrapper" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputRefs.current[idx] = el)}
                                type="text"
                                maxLength="1"
                                required
                                className="otp-digit-input"
                                value={digit}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                            />
                        ))}
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading || otp.some(digit => digit === '')}>
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>

                <p className="auth-footer">
                    Didn't receive the code?
                    <button 
                        onClick={handleResend} 
                        disabled={!canResend}
                        style={{ color: canResend ? 'var(--accent-secondary)' : 'var(--text-muted)', fontWeight: 700 }}
                    >
                        {canResend ? "Resend Code" : `Resend in ${cooldown}s`}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
