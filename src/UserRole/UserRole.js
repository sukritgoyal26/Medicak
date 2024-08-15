import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import './UserRole.css'
const UserRole = () => {
    const [role, setRole] = useState('');
    const [qualification, setQualification] = useState('');
    const [licenceNo, setLicenceNo] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate function
    const userId = location.state?.userId;

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        // Clear additional fields when role changes
        setQualification('');
        setLicenceNo('');
        setHospitalName('');
        setGstNo('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/user/change_role', {
                userId,
                role,
                qualification,
                licence_no: role === 'DOCTOR' ? licenceNo : undefined,
                hospitalName: role === 'DOCTOR' ? hospitalName : undefined,
                gst_no: role === 'PHARMACIST' ? gstNo : undefined
            });
            setMessage('Role updated successfully!');
            setTimeout(() => {
                navigate('/login'); // Redirect to login after success
            }, 2000);
        } catch (error) {
            console.error('Error updating role:', error);
            setMessage('Failed to update role.');
        }
    };

    return (
        <div className="update-role-container">
            <h2>Update Role</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={handleRoleChange}
                        required
                    >
                        <option value="">Select a role</option>
                        <option value="DOCTOR">DOCTOR</option>
                        <option value="PHARMACIST">PHARMACIST</option>
                    </select>
                </div>
                {role === 'DOCTOR' && (
                    <>
                        <div>
                            <label htmlFor="qualification">Qualification:</label>
                            <input
                                type="text"
                                id="qualification"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="licenceNo">Licence Number:</label>
                            <input
                                type="text"
                                id="licenceNo"
                                value={licenceNo}
                                onChange={(e) => setLicenceNo(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="hospitalName">Hospital Name:</label>
                            <input
                                type="text"
                                id="hospitalName"
                                value={hospitalName}
                                onChange={(e) => setHospitalName(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                {role === 'PHARMACIST' && (
                    <div className="pharma">
                        <label htmlFor="gstNo">GST Number:</label>
                        <input
                            type="text"
                            id="gstNo"
                            value={gstNo}
                            onChange={(e) => setGstNo(e.target.value)}
                            required
                        />
                        
                            <label htmlFor="qualification">Qualification:</label>
                            <input
                                type="text"
                                id="qualification"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                required
                            />
                        
                    </div>
                )}
                <button type="submit">Update Role</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserRole;
