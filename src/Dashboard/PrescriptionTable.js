import React, { useState } from 'react';
import './PrescriptionTable.css';

const PrescriptionTable = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [healthCardId, setHealthCardId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [amount, setAmount] = useState('');

    const fetchPrescriptions = () => {
        fetch(`http://localhost:8080/healthcard/getPrescriptionByHealthIdPharmasist?health_card_id=${healthCardId}`)
            .then(response => response.json())
            .then(data => setPrescriptions(data))
            .catch(error => console.error('Error fetching prescriptions:', error));
    };

    const handlePay = (prescriptionId) => {
        setSelectedPrescriptionId(prescriptionId);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPrescriptionId(null);
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setAmount('');
    };

    const handleSubmitPayment = () => {
        fetch(`http://localhost:8080/user/payment?prescriptionId=${selectedPrescriptionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cardNumber,
                expiryDate,
                cvv,
                amount
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Payment response:', data);

            // Remove the prescription from the list
            setPrescriptions(prevPrescriptions => 
                prevPrescriptions.filter(prescription => 
                    prescription.prescription_id !== selectedPrescriptionId
                )
            );

            handleModalClose(); // Close the modal after submitting
        })
        .catch(error => console.error('Error submitting payment:', error));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Prescriptions</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={healthCardId}
                    onChange={(e) => setHealthCardId(e.target.value)}
                    placeholder="Enter Health Card ID"
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={fetchPrescriptions} style={{ padding: '5px 10px' }}>View</button>
            </div>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>Prescription ID</th>
                        <th>Status</th>
                        <th>Medicines</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {prescriptions.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No prescriptions found for this Health Card ID.</td>
                        </tr>
                    ) : (
                        prescriptions.map((item) => (
                            <tr key={item.prescription_id}>
                                <td>{item.prescription.prescriptionId}</td>
                                <td>{item.prescription.status}</td>
                                <td>
                                    <ul>
                                        {item.medicines.map((medicine) => (
                                            <li key={medicine.medicineId}>
                                                {medicine.medicineName} : {medicine.qty}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button onClick={() => handlePay(item.prescription.prescriptionId)}>Pay</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Confirm Payment</h3>
                        <p>Are you sure you want to proceed with the payment for Prescription ID: {selectedPrescriptionId}?</p>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Card Number:
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="Card Number"
                                    style={{ marginLeft: '10px', padding: '5px' }}
                                />
                            </label>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <label style={{ marginRight: '10px' }}>
                                Expiry Date:
                                <input
                                    type="text"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    placeholder="MM/YY"
                                    style={{ marginLeft: '10px', padding: '5px' }}
                                />
                            </label>
                            <label>
                                CVV:
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="CVV"
                                    style={{ marginLeft: '10px', padding: '5px' }}
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Amount:
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Amount"
                                    style={{ marginLeft: '10px', padding: '5px' }}
                                />
                            </label>
                        </div>
                        <div>
                            <button className="cancel" onClick={handleModalClose}>Cancel</button>
                            <button onClick={handleSubmitPayment}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionTable;
