import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);

// GET single category
router.get("/:id", getCategoryById);

// Protected routes (Admin only)
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
