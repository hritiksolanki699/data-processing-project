// components/HourlyTripChart.js
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getData } from '@/utils/axiosInstance';

const HourlyTripChart = () => {
  const [hourlyData, setHourlyData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchHourlyTrips = async () => {
      try {
        const data = await getData('/trip/hourly'); 
        setHourlyData(data);
      } catch (error) {
        console.error('Error fetching hourly trip data:', error);
      }
    };

    fetchHourlyTrips();
  }, []);

  useEffect(() => {
    if (hourlyData.length > 0) {
      // Destroy the existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create a new chart
      const ctx = document.getElementById('hourlyChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line', // Using line chart for hourly data
        data: {
          labels: hourlyData.map((data) => `${data._id}:00`), // Hourly labels
          datasets: [
            {
              label: 'Total Trips',
              data: hourlyData.map((data) => data.totalTrips),
              backgroundColor: 'rgba(75, 192, 192, 0.4)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Hour of Day',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Total Trips',
              },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [hourlyData]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Hourly Trip Data Visualization</h2>
      <canvas id="hourlyChart" width="400" height="400"></canvas>
    </div>
  );
};

export default HourlyTripChart;
