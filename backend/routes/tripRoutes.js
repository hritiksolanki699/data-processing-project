// routes/tripRoutes.js
import express from "express";
import multer from "multer";
import {
  getAggregatedTrips,
  getHourlyTrips,
  getTrips,
  uploadCSV,
} from "../controllers/tripController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Define the CSV upload route
router.post("/upload", verifyToken, upload.single("csvFile"), uploadCSV);
router.get("/", verifyToken, getTrips);

// Route for aggregated trips by PULocationID
router.get("/aggregated", verifyToken, getAggregatedTrips);

// Route for hourly trips data
router.get("/hourly", verifyToken, getHourlyTrips);

export default router;
