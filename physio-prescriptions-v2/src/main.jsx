import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/App';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin'; // <-- import this!
import PatientView from './pages/PatientView';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* <-- add this! */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/:patientSlug/prescription/:id" element={<PatientView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
