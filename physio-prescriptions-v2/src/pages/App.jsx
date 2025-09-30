import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

function Home() {
  return (
    <div>
      <h1>Physio Prescriptions</h1>
      <p>Use the admin dashboard to create prescriptions and share links with patients.</p>
      <ul>
        <li><Link to="/admin">Go to Admin Dashboard</Link></li>
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* ...other routes... */}
      </Routes>
    </div>
  );
}
