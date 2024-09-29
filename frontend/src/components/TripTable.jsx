import { useState, useEffect } from "react";
import { getData } from "@/utils/axiosInstance";
import io from "socket.io-client";

// Connect to the Socket.io server
const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const TripTable = () => {
  const [tripData, setTripData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const data = await getData(`/trip?page=${page}&limit=100`);
        setTripData(data.trips);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();

    // Listen for real-time CSV processing updates
    socket.on("csvChunkProcessed", () => {
      console.log("CSV processing complete, updating data...");
      fetchTripData(); 
    });

    return () => {
      socket.off("csvChunkProcessed");
    };
  }, [page]);

  // Filtered trip data based on search term
  const filteredData = tripData.filter(
    (trip) =>
      trip._id.toString().includes(searchTerm) ||
      trip.total_amount.toString().includes(searchTerm)
  );

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Trip Data Table
      </h1>

      <input
        type="text"
        placeholder="Search by Trip ID or Total Amount"
        className="mb-4 p-2 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Trip ID</th>
            <th className="border border-gray-300 p-2">Total Amount</th>
            <th className="border border-gray-300 p-2">Pickup Time</th>
            <th className="border border-gray-300 p-2">Dropoff Time</th>
            <th className="border border-gray-300 p-2">Passenger Count</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((trip) => (
            <tr key={trip._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{trip._id}</td>
              <td className="border border-gray-300 p-2">{trip.total_amount}</td>
              <td className="border border-gray-300 p-2">
                {new Date(trip.lpep_pickup_datetime).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(trip.lpep_dropoff_datetime).toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2">{trip.passenger_count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-lg font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripTable;
