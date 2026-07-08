import React, { useEffect } from 'react';
import { useAppDispatch } from '../app/reduxHooks';
import { googleLoginAction } from '../features/auth/authThunk';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = ({ mode = 'login' }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Callback function when Google authentication returns credential
        const handleCredentialResponse = (response) => {
            if (response.credential) {
                dispatch(googleLoginAction(response.credential, navigate, mode));
            }
        };

        const initializeGoogleSignIn = () => {
            const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
            
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-div"),
                    { 
                        theme: "outline", 
                        size: "large", 
                        width: "380", // width matches auth cards
                        text: "continue_with",
                        shape: "rectangular"
                    }
                );
            }
        };

        // If google client script is loaded, initialize, otherwise wait a bit
        if (window.google && window.google.accounts) {
            initializeGoogleSignIn();
        } else {
            const interval = setInterval(() => {
                if (window.google && window.google.accounts) {
                    initializeGoogleSignIn();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [dispatch, navigate, mode]);

    return (
        <div className="google-signin-container" style={{ position: 'relative', width: '100%', height: '48px', overflow: 'hidden', borderRadius: '14px', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
            {/* Assigno Styled Button underneath */}
            <button 
                type="button"
                className="auth-btn" 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.75rem', 
                    pointerEvents: 'none',
                    margin: 0,
                    borderRadius: '14px',
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                {/* Google SVG Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ background: '#FFFFFF', borderRadius: '50%', padding: '2px' }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
            </button>
            
            {/* Google Invisible Iframe overlay on top */}
            <div 
                id="google-signin-div" 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    opacity: 0.01, 
                    cursor: 'pointer',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            ></div>
        </div>
    );
};

export default GoogleSignInButton;
