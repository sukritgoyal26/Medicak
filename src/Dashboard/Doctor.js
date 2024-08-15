import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorPanel from './DoctorPanel'; // Import DoctorPanel component
import UserHealthHistory from './UserHealthHistory'; // Import UserHealthHistory component
import './Doctor.css'; 

const Doctor = ({ userData }) => {
    const [view, setView] = useState(null);
    const [doctorDetails, setDoctorDetails] = useState(null); // State to store doctor details
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        } else {
            // Fetch doctor details if userData is available
            fetch(`http://localhost:8080/user/getDoctorDetail?userId=${userData.userId}`)
                .then(response => response.json())
                .then(data => setDoctorDetails(data))
                .catch(error => {
                    console.error('Error fetching doctor details:', error);
                    navigate('/login'); // Redirect to login on error
                });
        }
    }, [userData, navigate]);

    const handleAddMedicalHistory = () => {
        setView('add');
    };

    const handleViewMedicalHistory = () => {
        setView('view');
    };

    const renderContent = () => {
        if (!userData || !doctorDetails) {
            return null; 
        }

        switch (view) {
            case 'add':
                return <DoctorPanel />;
            case 'view':
                return <UserHealthHistory />;
            default:
                return (
                    <div>
                        <h2>Doctor Dashboard</h2>
                        <div className="doctor-card">
                            <h3>{doctorDetails.name}</h3>
                            <p><strong>Name:</strong> {userData.name}</p>
                            
                            <p><strong>Licence:</strong> {doctorDetails.licence_no}</p>
                            <p><strong>Qualification:</strong> {doctorDetails.qualification} years</p>
                            <p><strong>Hospital</strong> {doctorDetails.hospitalName}</p>
                        </div>
                        <button onClick={handleAddMedicalHistory} className="btn">
                            Add Medical History
                        </button>
                        <button onClick={handleViewMedicalHistory} className="btn">
                            View Medical History
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="doctor-container">
            {renderContent()}
        </div>
    );
};

export default Doctor;
