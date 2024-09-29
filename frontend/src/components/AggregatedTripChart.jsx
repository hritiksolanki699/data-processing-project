// components/AggregatedTripChart.js
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getData } from '@/utils/axiosInstance';

const AggregatedTripChart = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAggregatedTrips = async () => {
      try {
        const data = await getData('/trip/aggregated'); // Adjust the endpoint as necessary
        setAggregatedData(data);
      } catch (error) {
        console.error('Error fetching aggregated trip data:', error);
      }
    };

    fetchAggregatedTrips();
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
        type: 'bar', // Using a bar chart for aggregated data
        data: {
          labels: aggregatedData.map((data) => `Location ${data._id}`), // Pickup location IDs
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
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Aggregated Trip Data Visualization</h2>
      <canvas id="aggregatedChart" width="400" height="400"></canvas>
    </div>
  );
};

export default AggregatedTripChart;
