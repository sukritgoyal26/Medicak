import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Registration from "./Registration/Registration";
import DoctorPanel from "./Dashboard/DoctorPanel";
import UserRole from "./UserRole/UserRole";
import PrescriptionTable from "./Dashboard/PrescriptionTable"; // Correct the import path
import UserHealthHistory from "./Dashboard/UserHealthHistory"; // Correct the import path
import Doctor from "./Dashboard/Doctor";
function App() {
    const [userData, setUserData] = useState(null);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<Login setUserData={setUserData} />}
                />
                <Route
                    path="/register"
                    element={<Registration />}
                />
                <Route
                    path="/dashboard"
                    element={<Dashboard userData={userData} />}
                />
                
                <Route
                    path="/update-roll"
                    element={<UserRole />}
                />
                
                <Route
                    path="/prescriptions"
                    element={<PrescriptionTable userData={userData} />} // Pass userData to PrescriptionTable
                />

                <Route
                    path="/health-history"
                    element={<UserHealthHistory />} // Ensure the route is inside <Routes>
                />

                 <Route path="/doctor" element={<Doctor userData={userData} />} />

            </Routes>

            
        </Router>
    );
}

export default App;
