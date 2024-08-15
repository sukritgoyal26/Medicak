import React, { useState } from "react";
import axios from 'axios';
import "./HealthCardForm.css"; 


const HealthCard = ({ userId, onSuccess, onError }) => {
    const [bloodGroup, setBloodGroup] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [previousDisease, setPreviousDisease] = useState("");
    const [previousPresciption, setPreviousPresciption] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const healthCard = {
            patientId: userId,
            bloodGroup,
            height: parseFloat(height),
            weight: parseFloat(weight),
            previousDisease,
            previousPresciption
        };

        try {
            const response = await axios.post('http://localhost:8080/healthcard/generate_health_card', healthCard);
            onSuccess(response.data);
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="healthcard-form">
            <h3>Generate Health Card</h3>
            <div>
                <label>Blood Group:</label>
                <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required />
            </div>
            <div>
                <label>Height (cm):</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
            </div>
            <div>
                <label>Weight (kg):</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
            </div>
            <div>
                <label>Previous Disease:</label>
                <input type="text" value={previousDisease} onChange={(e) => setPreviousDisease(e.target.value)} />
            </div>
            <div>
                <label>Previous Prescription:</label>
                <input type="text" value={previousPresciption} onChange={(e) => setPreviousPresciption(e.target.value)} />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Health Card"}
            </button>
        </form>
    );
};

export default HealthCard;
