// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './AuthContext';
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route for login/sign-up */}
          <Route path="/login" element={<LoginSignup />} />
          
          {/* Protected route for the dashboard; 
              Dashboard component itself handles redirecting if not authenticated */}
          <Route path="/" element={<Dashboard />} />

          {/* Fallback route redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
