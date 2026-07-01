import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PasswordInput from '../components/PasswordInput';
import { useAppDispatch, useAppSelector } from '../app/reduxHooks';
import { signupUser } from '../features/auth/authThunk';

const SignUp = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();

    const {isAuthenticated} = useAppSelector(
            (state) => state.auth
        );

    const handleSignup = async (e) => {

        e.preventDefault();

        dispatch(signupUser({
            name,
            email,
            password
        }))

    }

    const handleNavigate = () => {
        navigate('/login');
    };

    useEffect(() => {
        if(isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    return (

        <div className="auth-page">

            <div className="auth-container">

                <h1 className="auth-title">
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Create an account and start building without chaos.
                </p>

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
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >
                        Create Account
                    </button>

                </form>

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