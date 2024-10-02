// routes/tripRoutes.js
import express from "express";
import multer from "multer";
import {
  getAggregatedTrips,
  getHourlyTrips,
  averageFareByPickup,
  passengerCountDistribution,
  paymentTypeBreakdown,
  fareBreakdown,
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

// Route for average fare by pickup location
router.get("/average-fare", verifyToken, averageFareByPickup);

// Route for passenger count distribution
router.get("/passenger-count", verifyToken, passengerCountDistribution);

// Route for payment type breakdown
router.get("/payment-type", verifyToken, paymentTypeBreakdown);

// Route for fare breakdown (trip amount vs fare)
router.get("/fare-breakdown", verifyToken, fareBreakdown);

export default router;
