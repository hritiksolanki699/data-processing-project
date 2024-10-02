import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getData } from '@/utils/axiosInstance';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

const AverageFareChart = () => {
  const [averageFareData, setAverageFareData] = useState([]);
  const chartRef = useRef(null);

  const fetchAverageFare = async () => {
    try {
      const data = await getData('/trip/average-fare');
      setAverageFareData(data);
    } catch (error) {
      console.error('Error fetching average fare data:', error);
    }
  };

  useEffect(() => {
    fetchAverageFare();

    socket.on('csvChunkProcessed', () => {
      console.log('CSV processing complete, updating average fare chart...');
      fetchAverageFare();
    });

    return () => {
      socket.off('csvChunkProcessed');
    };
  }, []);

  useEffect(() => {
    if (averageFareData.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('averageFareChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: averageFareData.map((data) => `Location ${data._id}`),
          datasets: [
            {
              label: 'Average Fare',
              data: averageFareData.map((data) => data.averageFare),
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderColor: 'rgba(255, 159, 64, 1)',
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
                text: 'Average Fare Amount',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Pickup Locations',
              },
            },
          },
        },
      });
    }
  }, [averageFareData]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Average Fare by Pickup Location
      </h2>
      <canvas id="averageFareChart" width="400" height="400"></canvas>
    </div>
  );
};

export default AverageFareChart;
