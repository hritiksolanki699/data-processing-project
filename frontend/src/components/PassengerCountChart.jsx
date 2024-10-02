import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getData } from '@/utils/axiosInstance';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const PassengerCountChart = () => {
  const [passengerData, setPassengerData] = useState([]);
  const chartRef = useRef(null);

  const fetchPassengerCount = async () => {
    try {
      const data = await getData('/trip/passenger-count');
      setPassengerData(data);
    } catch (error) {
      console.error('Error fetching passenger count data:', error);
    }
  };

  useEffect(() => {
    fetchPassengerCount();

    socket.on('csvChunkProcessed', () => {
      console.log('CSV processing complete, updating passenger count chart...');
      fetchPassengerCount();
    });

    return () => {
      socket.off('csvChunkProcessed');
    };
  }, []);

  useEffect(() => {
    if (passengerData.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('passengerChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: passengerData.map((data) => `Passengers: ${data._id}`),
          datasets: [
            {
              label: 'Passenger Count',
              data: passengerData.map((data) => data.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });
    }
  }, [passengerData]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Passenger Count Distribution
      </h2>
      <canvas id="passengerChart" width="400" height="400"></canvas>
    </div>
  );
};

export default PassengerCountChart;
