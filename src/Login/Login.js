import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setUserData }) => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/user/login", { emailId, password });
            // Set user data in App state
            setUserData(response.data);
            // Redirect based on user role
            if (response.data.role === "DOCTOR") {
                navigate("/doctor"); // Pass user data to Doctor route
            } else if (response.data.role === "PHARMACIST") {
                navigate("/prescriptions"); // Redirect to PrescriptionTable
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError("Invalid credentials. Please try again.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email : </label>
                    <input
                        type="email"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password : </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="register-link">
                <button type="submit">Login</button>
                <button onClick={handleRegister}>Register</button>
            </div>
            </form>
            
        </div>
    );
};

export default Login;
