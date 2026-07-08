import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import PasswordInput from '../components/PasswordInput';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { loginUser } from '../features/auth/authThunk';
import { clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import GoogleSignInButton from '../components/GoogleSignInButton';
import Loader from '../components/Loader';
import '../styles/auth.css';
const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useAppDispatch();
    const {isAuthenticated, error, message, loading} = useAppSelector(
        (state) => state.auth
    );


    const handleLogin = async (e) => {
        e.preventDefault();

        // Field validation
        if (!email.trim() || !password.trim()) {
            toast.error("Email and Password are required.");
            return;
        }

        // Email format validation (so no API call/fetch happens with invalid formats)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.");
            return;
        }

        dispatch(loginUser({
            email: email.trim(),
            password,
            rememberMe
        }, navigate));
    };


    const handleNavigate = () => {
        navigate('/signup');
    };

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            if (message) {
                toast.success(message);
            }
            navigate('/projects')
        }
    }, [isAuthenticated, message, navigate])
    return (

        <div className="auth-page">
            {loading && <Loader variant="orbit" fullscreen={true} />}

            <div className="auth-container">

                <h1 className="auth-title">
                    Welcome Back
                </h1>

                <p className="auth-subtitle">
                    Track your projects, deadlines, and progress effortlessly.
                </p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >

                    <div className="input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            className="auth-input"
                            type="email"
                            id="email"
                            placeholder="e.g. user@gmail.com"
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

                    <div className="auth-options">

                        <div className="remember-box">

                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                            />

                            <label htmlFor="remember">
                                Remember me
                            </label>

                        </div>

                        <a
                            href="/forgot-password"
                            className="forgot-link"
                        >
                            Forgot password?
                        </a>

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        Login
                    </button>

                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <GoogleSignInButton mode="login" />

                <p className="auth-footer">

                    Don&apos;t have an account?

                    <button onClick={handleNavigate}>
                        Signup
                    </button>

                </p>
                

            </div>

        </div>

    );

};

export default Login;
