import Trip from "../models/Trip.js";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { promisify } from "util";
import { io } from "../server.js";
const uploadsDir = path.resolve("uploads");
const unlinkAsync = promisify(fs.unlink);

import mongoose from "mongoose";

export const getTrips = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const searchTerm = req.query.search || "";

  try {
    let query = {};

    // Check if the searchTerm is a valid ObjectId
    if (searchTerm) {
      query = {
        $or: [
          // If the search term is a valid ObjectId, use it for exact matching
          ...(mongoose.Types.ObjectId.isValid(searchTerm)
            ? [{ _id: searchTerm }]
            : []),

          // Otherwise, use regex for string fields (like total_amount)
          ...(isNaN(searchTerm)
            ? []
            : [{ total_amount: parseFloat(searchTerm) }]),
        ],
      };
    }

    // Fetch filtered and paginated trips
    const trips = await Trip.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total number of documents for pagination
    const total = await Trip.countDocuments(query);

    // Send paginated data
    res.json({
      trips,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get aggregated trip data by PULocationID
export const getAggregatedTrips = async (req, res) => {
  try {
    const aggregatedData = await Trip.aggregate([
      {
        $group: {
          _id: "$PULocationID",
          totalTrips: { $sum: 1 },
          averageFare: { $avg: "$fare_amount" },
        },
      },
      { $sort: { totalTrips: -1 } },
    ]);

    res.json(aggregatedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get hourly trips aggregation
export const getHourlyTrips = async (req, res) => {
  try {
    const hourlyTrips = await Trip.aggregate([
      {
        $project: {
          hour: { $hour: "$lpep_pickup_datetime" },
        },
      },
      {
        $group: {
          _id: "$hour",
          totalTrips: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(hourlyTrips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const averageFareByPickup = async (req, res) => {
  try {
    const aggregatedData = await Trip.aggregate([
      {
        $group: {
          _id: "$PULocationID",
          averageFare: { $avg: "$fare_amount" },
        },
      },
      { $sort: { averageFare: -1 } },
    ]);

    res.json(aggregatedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const passengerCountDistribution = async (req, res) => {
  try {
    const passengerData = await Trip.aggregate([
      {
        $group: {
          _id: "$passenger_count",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(passengerData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const paymentTypeBreakdown = async (req, res) => {
  try {
    const paymentData = await Trip.aggregate([
      {
        $group: {
          _id: "$payment_type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(paymentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fareBreakdown = async (req, res) => {
  try {
    const fareData = await Trip.aggregate([
      {
        $group: {
          _id: "$PULocationID",
          totalFare: { $sum: "$fare_amount" },
          totalTolls: { $sum: "$tolls_amount" },
          totalSurcharges: {
            $sum: { $add: ["$tip_amount", "$improvement_surcharge"] },
          },
        },
      },
      { $sort: { totalFare: -1 } },
    ]);

    res.json(fareData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadCSV = async (req, res) => {
  try {
    // Save the file and return response immediately
    const filePath = path.join(uploadsDir, req.file.filename);
    res.status(200).json({
      message: "File uploaded, processing will be done in the background.",
    });

    // Process the file in the background
    processCSVFile(filePath);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file");
  }
};

const processCSVFile = async (filePath) => {
  const results = [];
  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // Insert data into database in chunks to avoid memory issues
          const chunkSize = 1000;
          for (let i = 0; i < results.length; i += chunkSize) {
            const chunk = results.slice(i, i + chunkSize);
            await Trip.insertMany(chunk);

            // Emit a real-time update after each chunk insertion
            io.emit("csvChunkProcessed", {
              message: `Inserted ${i + chunk.length} of ${
                results.length
              } records`,
            });
          }
          console.log("Data successfully inserted into the database");
          io.emit("csvProcessed", { message: "CSV processing complete" });
        } catch (err) {
          console.error("Error inserting data:", err);
        } finally {
          // Remove the file after processing
          await unlinkAsync(filePath);
        }
      })
      .on("error", (err) => {
        console.error("Error reading the file:", err);
      });
  } catch (err) {
    console.error("Error during file processing:", err);
  }
};
