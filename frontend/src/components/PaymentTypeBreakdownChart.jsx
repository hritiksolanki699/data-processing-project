import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { getData } from "@/utils/axiosInstance";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const PaymentTypeBreakdownChart = () => {
  const [paymentData, setPaymentData] = useState([]);
  const chartRef = useRef(null);

  const fetchPaymentTypeData = async () => {
    try {
      const data = await getData("/trip/payment-type");
      setPaymentData(data);
    } catch (error) {
      console.error("Error fetching payment type data:", error);
    }
  };

  useEffect(() => {
    fetchPaymentTypeData();

    socket.on("csvChunkProcessed", () => {
      console.log("CSV processing complete, updating payment type chart...");
      fetchPaymentTypeData();
    });

    return () => {
      socket.off("csvChunkProcessed");
    };
  }, []);

  useEffect(() => {
    if (paymentData.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctxPayment = document
        .getElementById("paymentChart")
        .getContext("2d");
      chartRef.current = new Chart(ctxPayment, {
        type: "pie",
        data: {
          labels: paymentData.map((data) => `Type: ${data._id}`),
          datasets: [
            {
              label: "Payment Type Breakdown",
              data: paymentData.map((data) => data.count),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    }
  }, [paymentData]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Payment Type Breakdown
      </h2>
      <canvas id="paymentChart" width="400" height="400"></canvas>
    </div>
  );
};

export default PaymentTypeBreakdownChart;
