import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EmployeeProfile.css";

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
      if (res.data.success) {
        setEmployee(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      alert("Error loading employee details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading employee details...</h2>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="loading-screen">
        <h2>Employee not found</h2>
        <button onClick={() => navigate("/employees")}>Back to List</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate("/employees")}>
          ← Back to List
        </button>
        {(user?.role === "admin" || user?.role === "manager") && (
          <button
            className="btn-edit-profile"
            onClick={() => navigate(`/employees/edit/${employee._id}`)}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {/* Header Card with Photo */}
        <div className="profile-card header-card">
          <div className="profile-photo-large">
            {employee.profilePhoto ? (
              <img
                src={`http://localhost:5000/uploads/profiles/${employee.profilePhoto}`}
                alt={employee.name}
              />
            ) : (
              <div className="no-photo-large">
                {employee.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-header-info">
            <h1>{employee.name}</h1>
            <p className="emp-id-large">ID: {employee.employeeId}</p>
            <p className="designation-large">{employee.designation}</p>
            <p className="department-large">📂 {employee.department}</p>
            <div className="status-badge">
              {employee.isActive ? "✅ Active" : "❌ Inactive"}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-card">
          <h2>👤 Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{employee.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{employee.phone}</span>
            </div>
            {employee.alternatePhone && (
              <div className="info-item">
                <span className="info-label">Alternate Phone:</span>
                <span className="info-value">{employee.alternatePhone}</span>
              </div>
            )}
            {employee.dateOfBirth && (
              <div className="info-item">
                <span className="info-label">Date of Birth:</span>
                <span className="info-value">
                  {new Date(employee.dateOfBirth).toLocaleDateString("en-IN")}
                </span>
              </div>
            )}
            {employee.gender && (
              <div className="info-item">
                <span className="info-label">Gender:</span>
                <span className="info-value">{employee.gender}</span>
              </div>
            )}
            {employee.bloodGroup && (
              <div className="info-item">
                <span className="info-label">Blood Group:</span>
                <span className="info-value">{employee.bloodGroup}</span>
              </div>
            )}
            {employee.maritalStatus && (
              <div className="info-item">
                <span className="info-label">Marital Status:</span>
                <span className="info-value">{employee.maritalStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        {employee.address && (
          <div className="profile-card">
            <h2>🏠 Address</h2>
            <div className="info-grid">
              {employee.address.street && (
                <div className="info-item full-width">
                  <span className="info-label">Street:</span>
                  <span className="info-value">{employee.address.street}</span>
                </div>
              )}
              {employee.address.city && (
                <div className="info-item">
                  <span className="info-label">City:</span>
                  <span className="info-value">{employee.address.city}</span>
                </div>
              )}
              {employee.address.state && (
                <div className="info-item">
                  <span className="info-label">State:</span>
                  <span className="info-value">{employee.address.state}</span>
                </div>
              )}
              {employee.address.country && (
                <div className="info-item">
                  <span className="info-label">Country:</span>
                  <span className="info-value">{employee.address.country}</span>
                </div>
              )}
              {employee.address.pincode && (
                <div className="info-item">
                  <span className="info-label">Pincode:</span>
                  <span className="info-value">{employee.address.pincode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professional Information */}
        <div className="profile-card">
          <h2>💼 Professional Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">{employee.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Designation:</span>
              <span className="info-value">{employee.designation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Joining Date:</span>
              <span className="info-value">
                {new Date(employee.joiningDate).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Employment Type:</span>
              <span className="info-value">{employee.employmentType}</span>
            </div>
            {employee.reportingManager && (
              <div className="info-item">
                <span className="info-label">Reporting Manager:</span>
                <span className="info-value">
                  {employee.reportingManager.name} (
                  {employee.reportingManager.employeeId})
                </span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Salary:</span>
              <span className="info-value salary-highlight">
                ₹{employee.salary?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {employee.bankDetails && (
          <div className="profile-card">
            <h2>🏦 Bank Details</h2>
            <div className="info-grid">
              {employee.bankDetails.accountNumber && (
                <div className="info-item">
                  <span className="info-label">Account Number:</span>
                  <span className="info-value">
                    {employee.bankDetails.accountNumber}
                  </span>
                </div>
              )}
              {employee.bankDetails.bankName && (
                <div className="info-item">
                  <span className="info-label">Bank Name:</span>
                  <span className="info-value">
                    {employee.bankDetails.bankName}
                  </span>
                </div>
              )}
              {employee.bankDetails.ifscCode && (
                <div className="info-item">
                  <span className="info-label">IFSC Code:</span>
                  <span className="info-value">
                    {employee.bankDetails.ifscCode}
                  </span>
                </div>
              )}
              {employee.bankDetails.branch && (
                <div className="info-item">
                  <span className="info-label">Branch:</span>
                  <span className="info-value">
                    {employee.bankDetails.branch}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {employee.emergencyContact && (
          <div className="profile-card">
            <h2>🚨 Emergency Contact</h2>
            <div className="info-grid">
              {employee.emergencyContact.name && (
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">
                    {employee.emergencyContact.name}
                  </span>
                </div>
              )}
              {employee.emergencyContact.relationship && (
                <div className="info-item">
                  <span className="info-label">Relationship:</span>
                  <span className="info-value">
                    {employee.emergencyContact.relationship}
                  </span>
                </div>
              )}
              {employee.emergencyContact.phone && (
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">
                    {employee.emergencyContact.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfile;