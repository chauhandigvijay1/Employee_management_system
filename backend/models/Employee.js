const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Basic Information
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    
    // Personal Information
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    
    // Contact Information
    phone: {
      type: String,
      required: true,
    },
    alternatePhone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    
    // Professional Information
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Intern"],
      default: "Full-time",
    },
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    
    // Salary Information
    salary: {
      type: Number,
      required: true,
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      branch: String,
    },
    
    // Profile Photo
    profilePhoto: {
      type: String,
      default: null,
    },
    
    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    
    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // User Account Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Auto-generate employee ID before saving
employeeSchema.pre("save", async function (next) {
  if (!this.employeeId) {
    const count = await mongoose.model("Employee").countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);