import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>👨‍💼 EMS Dashboard</h2>
        </div>
        <div className="navbar-user">
          <span className="user-info">
            {user?.username} <span className="role-badge">{user?.role}</span>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.username}! 👋</h1>
          <p>Here's what's happening with your organization today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Employees</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Present Today</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏖️</div>
            <div className="stat-info">
              <h3>On Leave</h3>
              <p className="stat-number">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Pending Requests</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button
              className="action-btn"
              onClick={() => navigate("/employees")}
            >
              📋 View Employees
            </button>
            
            {user?.role === "admin" && (
              <button className="action-btn">➕ Add Employee</button>
            )}
            
            <button className="action-btn">⏰ Mark Attendance</button>
            <button className="action-btn">🏖️ Apply Leave</button>
            <button className="action-btn">💰 View Payroll</button>
            <button className="action-btn">📊 Reports</button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">ℹ️</span>
              <div className="activity-content">
                <p>No recent activity to display</p>
                <span className="activity-time">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;