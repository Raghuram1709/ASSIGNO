import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PasswordInput from '../components/PasswordInput';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { signupUser } from '../features/auth/authThunk';
import { clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import GoogleSignInButton from '../components/GoogleSignInButton';
import Loader from '../components/Loader';

const SignUp = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();

    const {isAuthenticated, error, message, loading} = useAppSelector(
            (state) => state.auth
        );

    const handleSignup = async (e) => {
        e.preventDefault();

        // Field validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("Username, Email, and Password are required.");
            return;
        }

        // Email format validation (so no API call/fetch happens with invalid formats)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.");
            return;
        }

        dispatch(signupUser({
            name: name.trim(),
            email: email.trim(),
            password
        }, navigate));
    };

    const handleNavigate = () => {
        navigate('/login');
    };

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if(isAuthenticated) {
            if (message) {
                toast.success(message);
            }
            navigate('/')
        }
    }, [isAuthenticated, message, navigate])

    return (

        <div className="auth-page">
            {loading && <Loader variant="orbit" fullscreen={true} />}

            <div className="auth-container">

                <h1 className="auth-title">
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Create an account and start building without chaos.
                </p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form
                    className="auth-form"
                    onSubmit={handleSignup}
                >

                    <div className="input-group">

                        <label htmlFor="name">
                            Username
                        </label>

                        <input
                            className="auth-input"
                            type="text"
                            id="name"
                            placeholder="User151"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            className="auth-input"
                            type="email"
                            id="email"
                            placeholder="User151@gmail.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            onBlur={(e) => {
                                const val = e.target.value.trim();
                                if (val) {
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    if (!emailRegex.test(val)) {
                                        toast.error("Please enter a valid email address.");
                                    }
                                }
                            }}
                            required
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <PasswordInput
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required={true}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >
                        Create Account
                    </button>

                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <GoogleSignInButton mode="signup" />

                <p className="auth-footer">

                    Already have an account?

                    <button onClick={handleNavigate}>
                        Login
                    </button>

                </p>

            </div>

        </div>

    );

};

export default SignUp;