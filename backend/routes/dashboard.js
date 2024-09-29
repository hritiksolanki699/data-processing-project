import express from "express";
import { verifyToken, roleCheck } from "../middlewares/auth.js";

const router = express.Router();

// Protected route for Admin
router.get("/admin", verifyToken, roleCheck(["Admin"]), (req, res) => {
  res.send("Admin Dashboard: Full Access");
});

// Protected route for Manager
router.get(
  "/manager",
  verifyToken,
  roleCheck(["Admin", "Manager"]),
  (req, res) => {
    res.send("Manager Dashboard: Limited Access");
  }
);

// Protected route for Users
router.get(
  "/user",
  verifyToken,
  roleCheck(["User", "Admin", "Manager"]),
  (req, res) => {
    res.send("User Dashboard: Read-Only Access");
  }
);

export default router;
