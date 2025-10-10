const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  searchEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} = require("../controllers/employeeController");

router.post("/", addEmployee);
router.get("/", getEmployees);
router.get("/search/:key", searchEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.get("/stats", getStats);

module.exports = router;
