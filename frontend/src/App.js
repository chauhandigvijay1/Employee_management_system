import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    email: ""
  });

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
        email: ""
      });
      fetchEmployees();
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  return (
    <div className="container">
      <h1>👨‍💻 Employee Management System</h1>

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
  );
}

export default App;
