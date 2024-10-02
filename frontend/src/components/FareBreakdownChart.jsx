import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { getData } from "@/utils/axiosInstance";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const FareBreakdownChart = () => {
  const [fareData, setFareData] = useState([]);
  const chartRef = useRef(null);

  const fetchFareBreakdownData = async () => {
    try {
      const data = await getData("/trip/fare-breakdown");
      setFareData(data);
    } catch (error) {
      console.error("Error fetching fare breakdown data:", error);
    }
  };

  useEffect(() => {
    fetchFareBreakdownData();

    socket.on("csvChunkProcessed", () => {
      console.log("CSV processing complete, updating fare breakdown chart...");
      fetchFareBreakdownData();
    });

    return () => {
      socket.off("csvChunkProcessed");
    };
  }, []);

  useEffect(() => {
    if (fareData.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctxFare = document.getElementById("fareChart").getContext("2d");
      chartRef.current = new Chart(ctxFare, {
        type: "bar",
        data: {
          labels: fareData.map((data) => `Location: ${data._id}`),
          datasets: [
            {
              label: "Total Fare",
              data: fareData.map((data) => data.totalFare),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Total Tolls",
              data: fareData.map((data) => data.totalTolls),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "Total Surcharges",
              data: fareData.map((data) => data.totalSurcharges),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    }
  }, [fareData]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Fare Breakdown (Trip Amount vs Fare)
      </h2>
      <canvas id="fareChart" width="400" height="400"></canvas>
    </div>
  );
};

export default FareBreakdownChart;
