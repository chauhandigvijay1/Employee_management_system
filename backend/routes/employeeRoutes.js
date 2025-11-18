const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  searchEmployee,
  updateEmployee,
  deleteEmployee,
  uploadPhoto,
  getStats,
} = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/auth");
const { uploadProfilePhoto } = require("../middleware/upload");

// Stats route (must be before :id route)
router.get("/stats", protect, getStats);

// Search route (must be before :id route)
router.get("/search/:key", protect, searchEmployee);

// Main CRUD routes
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  uploadProfilePhoto,
  addEmployee
);

router.get("/", protect, getEmployees);

router.get("/:id", protect, getEmployeeById);

router.put(
  "/:id",
  protect,
  authorize("admin", "manager"),
  uploadProfilePhoto,
  updateEmployee
);

router.delete("/:id", protect, authorize("admin"), deleteEmployee);

// Photo upload route
router.put(
  "/:id/photo",
  protect,
  uploadProfilePhoto,
  uploadPhoto
);

module.exports = router;