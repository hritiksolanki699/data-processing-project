import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getData } from '@/utils/axiosInstance';
import io from 'socket.io-client';

// Connect to the Socket.io server
const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const AggregatedTripChart = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const chartRef = useRef(null);

  const fetchAggregatedTrips = async () => {
    try {
      const data = await getData('/trip/aggregated'); 
      setAggregatedData(data);
    } catch (error) {
      console.error('Error fetching aggregated trip data:', error);
    }
  };

  useEffect(() => {
    fetchAggregatedTrips(); 

    socket.on('csvChunkProcessed', () => {
      console.log('CSV processing complete, updating aggregated chart...');
      fetchAggregatedTrips(); 
    });

    return () => {
      socket.off('csvChunkProcessed');
    };
  }, []);

  useEffect(() => {
    if (aggregatedData.length > 0) {
      // Destroy the existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create a new chart
      const ctx = document.getElementById('aggregatedChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: aggregatedData.map((data) => `Location ${data._id}`), 
          datasets: [
            {
              label: 'Total Trips',
              data: aggregatedData.map((data) => data.totalTrips),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Average Fare',
              data: aggregatedData.map((data) => data.averageFare),
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count / Fare Amount',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Pickup Locations',
              },
            },
          },
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
  }, [aggregatedData]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Aggregated Trip Data Visualization
      </h2>
      <canvas id="aggregatedChart" width="400" height="400"></canvas>
    </div>
  );
};

export default AggregatedTripChart;
