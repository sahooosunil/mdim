// src/routes/stockRoutes.js
const express = require("express");
const router = express.Router();

const {
  updateStock, getStock, getStockById, deleteStock
} = require("../controllers/stockController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// 👇 Example Role Rules:
// admin → full access
// manager → can create/update/view
// viewer → can only view

// Get all stocks
router.get("/", authenticate, authorizeRoles("admin", "manager", "viewer"), getStock);

// Get stock by ID
router.get("/:id", authenticate, authorizeRoles("admin", "manager", "viewer"), getStockById);

// Add new stock entry
router.post("/", authenticate, authorizeRoles("admin", "manager"), updateStock);

// Delete a stock entry
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteStock);

module.exports = router;
