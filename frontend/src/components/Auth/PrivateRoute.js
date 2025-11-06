import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f23',
        color: '#fff',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (roles && !roles.includes(user?.role)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f23',
        color: '#ff6b6b',
        fontSize: '1.5rem',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>⛔ Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #48dbfb 0%, #7877c6 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;