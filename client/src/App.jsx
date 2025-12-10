import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";

// Common layout components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotFound from './components/common/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages
import Dashboard from './components/Dashboard';
import Tools from './components/Tools';

// Calculators
import BasicCalculator from './components/calculators/BasicCalculator';
import ScientificCalculator from './components/calculators/ScientificCalculator';
import GeometryCalculator from './components/calculators/GeometryCalculator';
import TrigTutor from './components/calculators/TrigTutor';
import UnitConverter from './components/calculators/UnitConverter';
import TimeZoneConverter from './components/calculators/TimeZoneConverter';
import DistanceCalculator from './components/calculators/DistanceCalculator';
import BMICalculator from './components/calculators/BMICalculator';
import PackingCalculator from './components/calculators/PackingCalculator';

// AI Assistant
import AiAssistant from './components/ai/AiAssistant';

import './App.css';

function App() {
  // State to track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };

    checkAuth();

    // Listen for custom userChanged event
    const handleUserChange = () => {
      checkAuth();
    };

    window.addEventListener('userChanged', handleUserChange);

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userChanged', handleUserChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        {/* Show Navbar only when logged in */}
        {isAuthenticated && <Navbar />}

        {/* Main content area with proper spacing */}
        <main style={{ 
          paddingTop: isAuthenticated ? '90px' : '0',
          minHeight: 'calc(100vh - 90px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Routes>

            {/* Public Routes - Login & Register */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Register />
              } 
            />

            {/* Protected Routes - Require Authentication */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/tools" 
              element={
                <ProtectedRoute>
                  <Tools />
                </ProtectedRoute>
              } 
            />

            {/* Calculator Routes - All Protected */}
            <Route 
              path="/basic" 
              element={
                <ProtectedRoute>
                  <BasicCalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scientific" 
              element={
                <ProtectedRoute>
                  <ScientificCalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/geometry" 
              element={
                <ProtectedRoute>
                  <GeometryCalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trig" 
              element={
                <ProtectedRoute>
                  <TrigTutor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trigtutor" 
              element={
                <ProtectedRoute>
                  <TrigTutor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/unit" 
              element={
                <ProtectedRoute>
                  <UnitConverter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/converter" 
              element={
                <ProtectedRoute>
                  <UnitConverter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timezone" 
              element={
                <ProtectedRoute>
                  <TimeZoneConverter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/distance" 
              element={
                <ProtectedRoute>
                  <DistanceCalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bmi" 
              element={
                <ProtectedRoute>
                  <BMICalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/packing" 
              element={
                <ProtectedRoute>
                  <PackingCalculator />
                </ProtectedRoute>
              } 
            />

            {/* AI Assistant - Protected */}
            <Route 
              path="/ai" 
              element={
                <ProtectedRoute>
                  <AiAssistant />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assistant" 
              element={
                <ProtectedRoute>
                  <AiAssistant />
                </ProtectedRoute>
              } 
            />

            {/* 404 Catch All */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>

        {/* Show Footer only when logged in */}
        {isAuthenticated && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;