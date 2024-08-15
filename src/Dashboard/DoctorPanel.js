import React, { useState } from 'react';
import axios from 'axios';
import './DoctorPanel.css';

const DoctorPanel = () => {
    const [healthCardId, setHealthCardId] = useState('');
    const [description, setDescription] = useState('');
    const [diagnosedDate, setDiagnosedDate] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [status, setStatus] = useState('');

    // Handle adding a new medicine entry
    const addMedicine = () => {
        setMedicines([...medicines, { medicineName: '', qty: '' }]);
    };

    // Handle changes in medicine details
    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = medicines.map((medicine, i) =>
            i === index ? { ...medicine, [field]: value } : medicine
        );
        setMedicines(updatedMedicines);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the health history data object
        const healthHistory = {
            healthCardId: parseInt(healthCardId),
            description,
            diagnosedDate,
            doctorName,
        };

        // Prepare the medicines array
        const medicinesArray = medicines.map(medicine => ({
            medicineName: medicine.medicineName,
            qty: parseInt(medicine.qty)
        }));

        // Prepare the request body with HealthHistory and List<Medicine>
        const requestBody = {
            healthHistory,
            medicine: medicinesArray
        };

        try {
            const response = await axios.post('http://localhost:8080/healthcard/save_health_history', requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Health history saved:', response.data);
            alert('Health history saved successfully!');
            setStatus('success');
        } catch (error) {
            console.error('There was an error saving the health history:', error);
            alert('Failed to save health history.');
            setStatus('error');
        }
    };

    return (
        <div className="doctor-panel-container">
            <form onSubmit={handleSubmit} className="doctor-panel-form">
                <div>
                    <label>Health Card ID:</label>
                    <input 
                        type="number" 
                        value={healthCardId}
                        onChange={(e) => setHealthCardId(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Diagnosed Date:</label>
                    <input 
                        type="date" 
                        value={diagnosedDate}
                        onChange={(e) => setDiagnosedDate(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Doctor Name:</label>
                    <input 
                        type="text" 
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)} 
                        required
                    />
                </div>
   
                <div>
                    <label>Medicines:</label>
                    <div className="medicines">
                        <div className="medicine-header">
                            <div className="medicine-header-item">Medicine Name</div>
                            <div className="medicine-header-item">Quantity</div>
                        </div>
                        {medicines.map((medicine, index) => (
                            <div key={index} className="medicine-entry">
                                <input 
                                    type="text" 
                                    placeholder="Medicine Name"
                                    value={medicine.medicineName}
                                    onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                                    required
                                />
                                <input 
                                    type="number" 
                                    placeholder="Quantity"
                                    value={medicine.qty}
                                    onChange={(e) => handleMedicineChange(index, 'qty', e.target.value)}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addMedicine}>Add Medicine</button>
                </div>
                <button type="submit" className="submit-btn">Save Health History</button>
                {status === 'success' && <p className="status-message success">Health history saved successfully!</p>}
                {status === 'error' && <p className="status-message error">Failed to save health history.</p>}
            </form>
        </div>
    );
};

export default DoctorPanel;
