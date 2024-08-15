import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorPanel from './DoctorPanel'; // Import DoctorPanel component
import UserHealthHistory from './UserHealthHistory'; // Import UserHealthHistory component
import './Doctor.css'; 

const Doctor = ({ userData }) => {
    const [view, setView] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
    }, [userData, navigate]);

    const handleAddMedicalHistory = () => {
        setView('add');
    };

    const handleViewMedicalHistory = () => {
        setView('view');
    };

    // Render content based on the view state
    const renderContent = () => {
        if (!userData) {
            return null; // Avoid rendering content if userData is not available
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
                        <p>Welcome, Dr. {userData.name}</p> {/* Display user name or other info */}
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
