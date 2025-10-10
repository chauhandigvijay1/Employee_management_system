const Employee = require("../models/Employee");

// Add new employee
exports.addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: "Error adding employee", error: err });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

// Search by ID or Name
exports.searchEmployee = async (req, res) => {
  const { key } = req.params;
  const employees = await Employee.find({
    $or: [
      { name: { $regex: key, $options: "i" } },
      { _id: key },
    ],
  });
  res.json(employees);
};

// Update
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// Delete
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await Employee.findByIdAndDelete(id);
  res.json({ message: "Employee removed" });
};

// Stats
exports.getStats = async (req, res) => {
  const total = await Employee.countDocuments();
  const avg = await Employee.aggregate([{ $group: { _id: null, avg: { $avg: "$salary" } } }]);
  const highest = await Employee.findOne().sort({ salary: -1 });
  const lowest = await Employee.findOne().sort({ salary: 1 });
  const deptCount = await Employee.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }]);
  res.json({
    totalEmployees: total,
    averageSalary: avg[0]?.avg || 0,
    highestSalary: highest?.salary || 0,
    lowestSalary: lowest?.salary || 0,
    departmentStats: deptCount
  });
};
