import React, { useState, useEffect } from "react";
import HealthCard from "../HealthCard/HealthCard";
import Modal from "react-modal";
import "./Dashboard.css";
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Dashboard = ({ userData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [healthCardId, setHealthCardId] = useState(null);
    const [healthHistory, setHealthHistory] = useState([]);
    const [medicineDetails, setMedicineDetails] = useState([]);
    const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate('/login');
            return;
        }

        if (userData.healthCardStatus === "GENERATED") {
            fetch(`http://localhost:8080/user/getHealthCardId?userId=${userData.userId}`)
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        throw new Error('Health Card ID not found');
                    }
                    setHealthCardId(data);

                    return fetch(`http://localhost:8080/user/userHealthHistory?healthCardId=${data}`);
                })
                .then(response => response.json())
                .then(history => {
                    if (!Array.isArray(history)) {
                        throw new Error('Invalid health history data');
                    }
                    setHealthHistory(history);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    navigate('/login');
                });
        }
    }, [userData, navigate]);

    const handleSuccess = (message) => {
        alert(`Health card generated successfully: ${message}`);
        setIsModalOpen(false);
    };

    const handleError = (errorMessage) => {
        alert(`Error generating health card: ${errorMessage}`);
    };

    const openModal = () => {
        if (userData.healthCardStatus === "NOT GENERATED") {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateRole = () => {
        navigate('/update-roll', { state: { userId: userData.userId } });
    };

    const fetchMedicineDetails = (healthHistoryId) => {
        fetch(`http://localhost:8080/healthcard/getPrescriptionByHealthHistoryPatient?health_history_id=${healthHistoryId}`)
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Invalid medicine details data');
                }
                setMedicineDetails(data);
            })
            .catch(error => {
                console.error('Error fetching medicine details:', error);
                navigate('/login');
            });
    };

    const openMedicineModal = (healthHistoryId) => {
        fetchMedicineDetails(healthHistoryId);
        setIsMedicineModalOpen(true);
    };

    const closeMedicineModal = () => {
        setIsMedicineModalOpen(false);
    };

    if (!userData) {
        return null; // Return null while redirecting
    }

    return (
        <div className="dashboard-container">
            <div className="user-card">
                <h2>Welcome, {userData.emailId}!</h2>
                <p><strong>User ID:</strong> {userData.userId}</p>
                <p><strong>Email:</strong> {userData.emailId}</p>
                <p><strong>Aadhaar ID:</strong> {userData.addharId}</p>
                <p><strong>Role:</strong> {userData.role}</p>
                <p><strong>Health Card Status:</strong> {userData.healthCardStatus}</p>
                
                {userData.healthCardStatus === "NOT GENERATED" ? (
                    <>
                        <button onClick={openModal}>
                            Generate Health Card
                        </button>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            contentLabel="Health Card Generator"
                            className="modal"
                            overlayClassName="overlay"
                        >
                            <HealthCard
                                userId={userData.userId}
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                            <button onClick={closeModal}>Close</button>
                        </Modal>
                    </>
                ) : (
                    <>
                        <p>Health card is already generated.</p>
                        {healthCardId && (
                            <p><strong>Health Card ID:</strong> {healthCardId}</p>
                        )}
                    </>
                )}

                <button onClick={handleUpdateRole}>
                    Update Role
                </button>
            </div>

            {healthHistory.length > 0 && (
                <div className="health-history">
                    <h3>Health History</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Health History Id</th>
                                <th>Description</th>
                                <th>Diagnosed Date</th>
                                <th>Doctor Name</th>
                                <th>Prescription ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {healthHistory.map(history => (
                                <tr key={history.healthHistoryId}>
                                    <td>{history.healthHistoryId}</td>
                                    <td>{history.description}</td>
                                    <td>{new Date(history.diagnosedDate).toLocaleDateString()}</td>
                                    <td>{history.doctorName}</td>
                                    <td>{history.prescriptionId}</td>
                                    <td>
                                        <button onClick={() => openMedicineModal(history.healthHistoryId)}>
                                            View Medicines
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isMedicineModalOpen}
                onRequestClose={closeMedicineModal}
                contentLabel="Medicine Details"
                className="modal"
                overlayClassName="overlay"
            >
                <h3>Medicines Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicineDetails.map(prescription => (
                            prescription.medicines.map(medicine => (
                                <tr key={medicine.medicineId}>
                                    <td>{medicine.medicineName}</td>
                                    <td>{medicine.qty}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
                <button onClick={closeMedicineModal}>Close</button>
            </Modal>
        </div>
    );
};

export default Dashboard;
