// src/Routes/suggestionRoutes.js
import express from "express";
import {
  createSuggestion,
  getAllSuggestions,
  getSuggestionById,
  updateSuggestion,
  deleteSuggestion,
  getMySuggestions,
} from "../Controllers/suggestionController.js";
import { validateSuggestion } from "../Validation/suggestionValidation.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../Middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC: fetch all or by status
router.get("/", getAllSuggestions);
// PUBLIC: get detail
router.get("/:id", getSuggestionById);

// RESIDENT: create & list their own
router.post(
  "/",
  authMiddleware,
  authorizeRoles("resident"),
  validateSuggestion,
  createSuggestion
);
router.get(
  "/my-suggestions",
  authMiddleware,
  authorizeRoles("resident"),
  getMySuggestions
);

// ADMIN/STAFF: update or delete any suggestion
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("staff", "admin"),
  validateSuggestion,
  updateSuggestion
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("staff", "admin"),
  deleteSuggestion
);

export default router;
