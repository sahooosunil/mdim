// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authenticate = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// 👇 Example Role Rules:
// admin → can do everything
// manager → can create/update
// viewer → can only read

// Public routes (if any)
// router.get("/public", publicControllerFunction);

// Protected routes
router.get("/", authenticate, authorizeRoles("admin", "manager", "viewer"), getAllProducts);
router.post("/", authenticate, authorizeRoles("admin", "manager"), createProduct);
router.put("/:id", authenticate, authorizeRoles("admin", "manager"), updateProduct);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteProduct);

module.exports = router;
