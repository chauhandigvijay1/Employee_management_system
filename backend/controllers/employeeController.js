const Employee = require("../models/Employee");
const path = require("path");
const fs = require("fs");

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private (Admin/Manager)
exports.addEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    
    // If profile photo was uploaded
    if (req.file) {
      employeeData.profilePhoto = req.file.filename;
    }

    const employee = new Employee(employeeData);
    await employee.save();
    
    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: employee,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error adding employee",
      error: err.message,
    });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .populate("reportingManager", "name employeeId")
      .populate("userId", "username email role")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: err.message,
    });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("reportingManager", "name employeeId designation")
      .populate("userId", "username email role");
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: err.message,
    });
  }
};

// @desc    Search employees by ID or Name
// @route   GET /api/employees/search/:key
// @access  Private
exports.searchEmployee = async (req, res) => {
  try {
    const { key } = req.params;
    const employees = await Employee.find({
      $or: [
        { name: { $regex: key, $options: "i" } },
        { employeeId: { $regex: key, $options: "i" } },
        { email: { $regex: key, $options: "i" } },
        { department: { $regex: key, $options: "i" } },
      ],
    });
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error searching employees",
      error: err.message,
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin/Manager)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // If new profile photo uploaded, delete old one
    if (req.file) {
      if (employee.profilePhoto) {
        const oldPhotoPath = path.join(
          __dirname,
          "../uploads/profiles/",
          employee.profilePhoto
        );
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      req.body.profilePhoto = req.file.filename;
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error updating employee",
      error: err.message,
    });
  }
};

// @desc    Delete employee (soft delete)
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Employee removed successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: err.message,
    });
  }
};

// @desc    Upload/Update profile photo
// @route   PUT /api/employees/:id/photo
// @access  Private
exports.uploadPhoto = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a photo",
      });
    }

    // Delete old photo if exists
    if (employee.profilePhoto) {
      const oldPhotoPath = path.join(
        __dirname,
        "../uploads/profiles/",
        employee.profilePhoto
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update with new photo
    employee.profilePhoto = req.file.filename;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      data: {
        profilePhoto: employee.profilePhoto,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error uploading photo",
      error: err.message,
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const total = await Employee.countDocuments({ isActive: true });
    
    const avgSalary = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: "$salary" } } },
    ]);
    
    const highest = await Employee.findOne({ isActive: true }).sort({ salary: -1 });
    const lowest = await Employee.findOne({ isActive: true }).sort({ salary: 1 });
    
    const deptCount = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const designationCount = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$designation", count: { $sum: 1 } } },
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalEmployees: total,
        averageSalary: avgSalary[0]?.avg || 0,
        highestSalary: highest?.salary || 0,
        lowestSalary: lowest?.salary || 0,
        departmentStats: deptCount,
        designationStats: designationCount,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: err.message,
    });
  }
};