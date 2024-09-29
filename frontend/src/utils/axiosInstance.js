import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json", 
  },
  withCredentials: true,
});

// Function to handle GET requests
export const getData = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle POST requests with dynamic content type
export const postData = async (url, data, isMultipart = false) => {
  try {
    const headers = {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    };

    const response = await axiosInstance.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle PUT requests with dynamic content type
export const putData = async (url, data, isMultipart = false) => {
  try {
    const headers = {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    };

    const response = await axiosInstance.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle DELETE requests
export const deleteData = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error.response ? error.response.data : error;
  }
};

export default axiosInstance;
