"use client";

// components/FileUpload.js
import { useState, useRef } from "react";
import { postData } from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await postData("/trip/upload", formData, true);
      toast.success("File uploaded successfully!");
      setFile(null);
      fileInputRef.current.value = null;
      setSuccess(response.data);
    } catch (err) {
      console.error("Error during file upload:", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-10 items-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700">
        Upload CSV File
      </h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mb-4 w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-l-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-gray-700 file:text-white
                     hover:file:bg-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md transition 
                      ${
                        loading
                          ? "bg-gray-400"
                          : "bg-gray-700 hover:bg-gray-600"
                      } 
                      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50`}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {success && (
        <p className="mt-4 text-green-600">
          Success: {JSON.stringify(success)}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
