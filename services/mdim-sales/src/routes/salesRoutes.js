const express = require("express");
const router = express.Router();
const { createSale, getAllSales } = require("../controllers/salesController");
const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Only admin or sales_manager can create a sale
router.post("/", authenticate, authorizeRoles("admin", "sales_manager"), createSale);

// Everyone (with token) can view sales
router.get("/", authenticate, authorizeRoles("admin", "sales_manager", "viewer"), getAllSales);

module.exports = router;