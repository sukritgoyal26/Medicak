import React, { useState } from 'react';
import './UserHealthHistory.css'; 

const UserHealthHistory = () => {
    const [healthCardId, setHealthCardId] = useState('');
    const [healthHistory, setHealthHistory] = useState([]);
    const [error, setError] = useState(null);
    const [modalData, setModalData] = useState(null); // State for modal data
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [editModalData, setEditModalData] = useState(null); // State for editable medicines
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal visibility

    const handleViewClick = () => {
        fetch(`http://localhost:8080/user/userHealthHistory?healthCardId=${healthCardId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No health history found');
                }
                return response.json();
            })
            .then(data => {
                setHealthHistory(data);
                setError(null);
            })
            .catch(error => {
                setHealthHistory([]);
                setError(error.message);
            });
    };

    const handleViewDetails = (healthHistoryId) => {
        fetch(`http://localhost:8080/healthcard/getPrescriptionByHealthHistoryIdDoctor?health_history_id=${healthHistoryId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No prescription found');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const [prescriptionData] = data;
                    setModalData(prescriptionData);
                    setEditModalData(prescriptionData.medicines); // Initialize edit data
                    setIsModalOpen(true);
                } else {
                    throw new Error('Unexpected data format');
                }
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData(null);
        setIsEditModalOpen(false); // Close the edit modal as well
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...editModalData];
        updatedMedicines[index] = {
            ...updatedMedicines[index],
            [field]: value
        };
        setEditModalData(updatedMedicines);
    };

    const handleSaveChanges = () => {
        fetch('http://localhost:8080/healthcard/update_medicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editModalData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update medicines');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            handleCloseModal(); // Close modals on success
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>View User Health History</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={healthCardId}
                    onChange={(e) => setHealthCardId(e.target.value)}
                    placeholder="Enter Health Card ID"
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={handleViewClick} style={{ padding: '5px 10px' }}>View</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {healthHistory.length > 0 && (
                <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th>Health History ID</th>
                            <th>Description</th>
                            <th>Diagnosed Date</th>
                            <th>Doctor Name</th>
                            <th>Prescription ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {healthHistory.map(item => (
                            <tr key={item.healthHistoryId}>
                                <td>{item.healthHistoryId}</td>
                                <td>{item.description}</td>
                                <td>{new Date(item.diagnosedDate).toLocaleDateString()}</td>
                                <td>{item.doctorName}</td>
                                <td>{item.prescriptionId}</td>
                                <td>
                                    <button onClick={() => handleViewDetails(item.healthHistoryId)} style={{ marginRight: '10px' }}>
                                        View
                                    </button>
                                    <button onClick={() => handleEditClick()} style={{ marginRight: '10px' }}>
                                        Update Medicine
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Prescription Details Modal */}
            {isModalOpen && modalData && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Prescription Details</h3>
                        <p><strong>Prescription ID:</strong> {modalData.prescription.prescriptionId}</p>
                        <p><strong>Status:</strong> {modalData.prescription.status}</p>
                        <p><strong>Health History ID:</strong> {modalData.prescription.healthHistoryId}</p>
                        <p><strong>Health Card ID:</strong> {modalData.prescription.healthCardId}</p>
                        <h4>Medicines</h4>
                        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th>Medicine ID</th>
                                    <th>Medicine Name</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalData.medicines.map(medicine => (
                                    <tr key={medicine.medicineId}>
                                        <td>{medicine.medicineId}</td>
                                        <td>{medicine.medicineName}</td>
                                        <td>{medicine.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleCloseModal} style={{ marginTop: '20px' }}>Close</button>
                    </div>
                </div>
            )}

            {/* Edit Medicines Modal */}
            {isEditModalOpen && editModalData && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Medicines</h3>
                        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th>Medicine ID</th>
                                    <th>Medicine Name</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editModalData.map((medicine, index) => (
                                    <tr key={medicine.medicineId}>
                                        <td>{medicine.medicineId}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={medicine.medicineName}
                                                onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={medicine.qty}
                                                onChange={(e) => handleMedicineChange(index, 'qty', e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleSaveChanges} style={{ marginTop: '20px' }}>Save Changes</button>
                        <button onClick={handleCloseModal} style={{ marginTop: '20px', marginLeft: '10px' }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHealthHistory;
