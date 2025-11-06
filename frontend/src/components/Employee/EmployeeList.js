import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    email: "",
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employees", form);
      setForm({
        name: "",
        department: "",
        designation: "",
        salary: "",
        joiningDate: "",
        email: "",
      });
      fetchEmployees();
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar" style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <h2 style={{
            background: 'linear-gradient(135deg, #48dbfb 0%, #ff6b6b 50%, #7877c6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            cursor: 'pointer'
          }} onClick={() => navigate('/dashboard')}>
            👨‍💼 EMS
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(72, 219, 251, 0.5)',
              color: '#48dbfb',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Dashboard
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#fff', fontWeight: 500 }}>
            {user?.username}
            <span style={{
              background: 'linear-gradient(135deg, #48dbfb, #7877c6)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              marginLeft: '10px'
            }}>
              {user?.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 25px',
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid #ff6b6b',
              color: '#ff6b6b',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <h1>👨‍💻 Employee Management</h1>

        {user?.role === "admin" && (
          <form onSubmit={addEmployee}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <input
              placeholder="Designation"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
            <input
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <button type="submit">Add Employee</button>
          </form>
        )}

        <h2>All Employees</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Joining Date</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.salary}</td>
                  <td>
                    {emp.joiningDate
                      ? new Date(emp.joiningDate).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td>{emp.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#ccc" }}>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;