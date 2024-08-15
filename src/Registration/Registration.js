import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; // Ensure you have this file for custom styling

const Registration = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [addharId, setAddharId] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // Initialize navigate function

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailId)) {
            setMessage('Invalid email format');
            return;
        }

        // Aadhar ID validation
        if (!/^\d{12}$/.test(addharId)) {
            setMessage('Aadhar ID must be exactly 12 digits');
            return;
        }

        // Date of Birth validation
        if (!dob) {
            setMessage('Date of Birth is required');
            return;
        }

        const user = {
            emailId: emailId,
            password: password,
            addharId: addharId,
            name: name,
            dob: dob
        };

        try {
            const response = await axios.post('http://localhost:8080/user/register', user);
            setMessage(response.data);  // Assuming the response is a string message
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    // Function to restrict input to numeric values only
    const handleAadharChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAddharId(value);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label >Email ID:</label>
                    <input 
                        type="email" 
                        value={emailId} 
                        onChange={(e) => setEmailId(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Aadhar ID:</label>
                    <input 
                        type="text" // Changed to text to avoid unintended behavior with type="number"
                        value={addharId} 
                        onChange={handleAadharChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)} 
                        required 
                    />
                </div>
                <div className="login-link">
                <button type="submit" className='btn'>Register</button>
                <button type='button' className="btn" onClick={handleLoginRedirect}>Login</button>
            </div>
            </form>
            {message && <p id="msg">{message}</p>}
        </div>
    );
};

export default Registration;
