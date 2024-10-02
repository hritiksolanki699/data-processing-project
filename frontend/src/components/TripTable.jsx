"use client";
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getData } from "@/utils/axiosInstance";
import io from "socket.io-client";

// Socket connection
const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const TripTable = () => {
  const [tripData, setTripData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch trip data from backend
  const fetchTripData = async (page = 1, search = "") => {
    try {
      const data = await getData(
        `/trip?page=${page}&limit=20&search=${search}`
      );
      setTripData(data.trips);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  useEffect(() => {
    fetchTripData(pageIndex + 1, searchTerm);

    socket.on("csvChunkProcessed", () => {
      console.log("CSV processing complete, updating data...");
      fetchTripData(pageIndex + 1, searchTerm);
    });

    return () => {
      socket.off("csvChunkProcessed");
    };
  }, [pageIndex, searchTerm]);

  // Table columns definition
  const columns = useMemo(
    () => [
      { accessorKey: "_id", header: "Trip ID" },
      { accessorKey: "total_amount", header: "Total Amount" },
      {
        accessorKey: "lpep_pickup_datetime",
        header: "Pickup Time",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      {
        accessorKey: "lpep_dropoff_datetime",
        header: "Dropoff Time",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      { accessorKey: "passenger_count", header: "Passenger Count" },
    ],
    []
  );

  const table = useReactTable({
    data: tripData,
    columns,
    pageCount: totalPages,
    state: { pagination: { pageIndex, pageSize: 20 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const { getHeaderGroups, getRowModel } = table;

  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
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
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={pageIndex === 0} // Disable if on the first page
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          Previous
        </button>

        {/* Correct display for current page and total pages */}
        <span className="text-lg font-medium text-gray-700">
          Page {pageIndex + 1} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pageIndex + 1 === totalPages} // Disable if on the last page
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripTable;
