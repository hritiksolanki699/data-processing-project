"use client";
import FileUpload from "@/components/FileUpload";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { user, role } = useSelector((state) => state.auth);
  return (
    <div>
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
    </div>
  );
};

export default Page;
