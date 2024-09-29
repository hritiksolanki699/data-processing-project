"use client";

import AggregatedTripChart from "@/components/AggregatedTripChart";
import FileUpload from "@/components/FileUpload";
import HourlyTripChart from "@/components/HourlyTripChart";
import TripChart from "@/components/TripTable";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { user, role } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl text-gray-800 font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* User Details Section */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-gray-800 font-semibold mb-4">
          User Details
        </h2>
        {user ? (
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Mobile Number:</strong> {user.mobileNumber}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Role:</strong> {role}
            </p>
          </div>
        ) : (
          <p className="text-gray-700">No user information available.</p>
        )}
      </div>
      <FileUpload />
      <div className="min-h-screen mt-10 shadow-lg  bg-gray-50">
        <TripChart />
      </div>
      <div className="min-h-screen mt-10 shadow-lg  bg-gray-50">
        <HourlyTripChart />
      </div>
      <div className="min-h-screen mt-10 shadow-lg  bg-gray-50">
        <AggregatedTripChart />
      </div>
    </div>
  );
}
