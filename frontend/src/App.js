import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import EmployeeList from "./components/Employee/EmployeeList";
import EmployeeForm from "./components/Employee/EmployeeForm";
import EmployeeProfile from "./components/Employee/EmployeeProfile";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/employees/add"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/employees/edit/:id"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/employees/view/:id"
            element={
              <PrivateRoute>
                <EmployeeProfile />
              </PrivateRoute>
            }
          />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#0f0f23',
                color: '#fff',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <h1>404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;