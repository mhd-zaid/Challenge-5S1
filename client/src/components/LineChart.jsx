import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const getReservationStats = async (token) => {
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stats/reservation', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': 'Bearer ' + token,
    },
  });
  const stats = await response.json();
  return stats;
};

const LineChart = () => {
  const [chartData, setChartData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getReservationStats(token);
        const dataByYear = {};
  
        stats['hydra:member'].forEach(item => {
          const year = item.year;
          const sampleMonths = item.months;
          const totalCA = Object.values(sampleMonths).map(month => month.totalCA);
  
          if (!dataByYear[year]) {
            dataByYear[year] = {
              labels: Object.keys(sampleMonths).map(month => month.substring(0, 3)),
              datasets: [],
            };
          }
  
          dataByYear[year].datasets.push({
            label: `CA des Réservations ${year}`,
            data: totalCA,
            borderColor: getRandomColor(),
            backgroundColor: 'rgba(0, 0, 0, 0)',
            fill: false,
            tension: 0.1,
          });
        });
  
        const labels = Object.keys(dataByYear[Object.keys(dataByYear)[0]].labels);
        const datasets = Object.values(dataByYear).flatMap(yearData => yearData.datasets);
  
        const finalChartData = {
          labels,
          datasets,
        };
  
        setChartData(finalChartData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
  
    if (token) {
      fetchData();
    }
  }, [token]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chiffre d\'Affaires des Réservations par Mois',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <>
        <Line data={chartData} options={options} />
    </>
  );
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default LineChart;
