import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EmployeeList.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/employees");
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchEmployees();
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/employees/search/${searchTerm}`
      );
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error("Error searching:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        fetchEmployees();
        alert("Employee deleted successfully");
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("Error deleting employee");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <h2
            style={{
              background:
                "linear-gradient(135deg, #48dbfb 0%, #ff6b6b 50%, #7877c6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            👨‍💼 EMS
          </h2>
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="nav-btn active">Employees</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "#fff", fontWeight: 500 }}>
            {user?.username}
            <span className="role-badge">{user?.role}</span>
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="employee-list-container">
        <div className="list-header">
          <h1>👥 Employee Directory</h1>
          
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch}>🔍 Search</button>
            </div>

            {(user?.role === "admin" || user?.role === "manager") && (
              <button
                className="btn-add"
                onClick={() => navigate("/employees/add")}
              >
                ➕ Add Employee
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : (
          <div className="employee-grid">
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div key={emp._id} className="employee-card">
                  <div className="card-photo">
                    {emp.profilePhoto ? (
                      <img
                        src={`http://localhost:5000/uploads/profiles/${emp.profilePhoto}`}
                        alt={emp.name}
                      />
                    ) : (
                      <div className="no-photo">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="card-content">
                    <h3>{emp.name}</h3>
                    <p className="emp-id">ID: {emp.employeeId}</p>
                    <p className="designation">{emp.designation}</p>
                    <p className="department">📂 {emp.department}</p>
                    <p className="email">✉️ {emp.email}</p>
                    <p className="phone">📞 {emp.phone}</p>
                    <p className="salary">💰 ₹{emp.salary?.toLocaleString()}</p>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/employees/view/${emp._id}`)}
                      >
                      👁️ View
                    </button>

                    {(user?.role === "admin" || user?.role === "manager") && (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() => navigate(`/employees/edit/${emp._id}`)}
                        >
                          ✏️ Edit
                        </button>

                        {user?.role === "admin" && (
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(emp._id)}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-employees">
                <h2>No employees found</h2>
                <p>Start by adding your first employee</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeList;