import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // Adjust the path to your User model

// Load environment variables from .env file
dotenv.config();

// Connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Seeder function to add users
const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        username: "adminuser",
        email: "admin@example.com",
        mobileNumber: "1234567890",
        password: "12345678",
        role: "Admin",
        isActive: true,
        address: {
          street: "123 Admin St",
          city: "Admin City",
          state: "Admin State",
          zipCode: "12345",
        },
      },
      {
        name: "Manager User",
        username: "manageruser",
        email: "manager@example.com",
        mobileNumber: "0987654321",
        password: "12345678",
        role: "Manager",
        isActive: true,
        address: {
          street: "456 Manager St",
          city: "Manager City",
          state: "Manager State",
          zipCode: "54321",
        },
      },
      {
        name: "Regular User",
        username: "regularuser",
        email: "user@example.com",
        mobileNumber: "1122334455",
        password: "12345678", 
        role: "User",
        isActive: true,
        address: {
          street: "789 User St",
          city: "User City",
          state: "User State",
          zipCode: "67890",
        },
      },
    ];

    // Save users one by one (to trigger `pre('save')` middleware)
    for (const userData of users) {
      const user = new User(userData);
      await user.save(); // `save()` triggers the `pre('save')` hook, so the password will be hashed
    }

    console.log("User seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding users: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeder function
const runSeeder = async () => {
  await connectDB();
  await seedUsers();
};

runSeeder();
