import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
    value,
    onChange,
    placeholder = "Enter password",
    name = "password",
    id = "password",
    required = false
}) => {

    const [showPassword, setShowPassword] = useState(false);

    return (

        <div className="password-wrapper">

            <input
                className="auth-input password-input"
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                id={id}
                required={required}
            />

            <button
                type="button"
                className="password-toggle"
                onClick={() =>
                    setShowPassword(!showPassword)
                }
            >

                {
                    showPassword
                        ? <FaEyeSlash />
                        : <FaEye />
                }

            </button>

        </div>

    );

};

export default PasswordInput;