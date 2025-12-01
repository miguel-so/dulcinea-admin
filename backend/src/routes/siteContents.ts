import express from "express";
import {
  getAllSiteContents,
  getSiteContentById,
  createSiteContent,
  updateSiteContent,
  deleteSiteContent,
} from "../controllers/siteContentController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllSiteContents);

// GET single category
router.get("/:id", getSiteContentById);

// Protected routes (Admin only)
router.post("/", protect, createSiteContent);
router.put("/:id", protect, updateSiteContent);
router.delete("/:id", protect, deleteSiteContent);

export default router;
