import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '@/context/AuthContext.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getStats = async (studio, token) => {
  const id = studio['@id'].split('/')[3];
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stats/studio/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/ld+json',
      'Authorization': 'Bearer ' + token,
    },
  });
  const stats = await response.json();
  return stats;
};

const BarChart = ({ studio }) => {
  const [chartData, setChartData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getStats(studio, token);
        const sampleMonths = stats['hydra:member'][0].months;
        const labels = Object.keys(sampleMonths).map(month => {
          const monthNames = {
            Jan: 'Jan',
            Feb: 'Fév',
            Mar: 'Mar',
            Apr: 'Avr',
            May: 'Mai',
            Jun: 'Juin',
            Jul: 'Juil',
            Aug: 'Août',
            Sep: 'Sept',
            Oct: 'Oct',
            Nov: 'Nov',
            Dec: 'Déc',
          };
          return monthNames[month];
        });

        const datasets = stats['hydra:member'].map((stat, index) => ({
          label: `Visites ${stat.year}`,
          data: Object.values(stat.months),
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: getRandomColor(),
          borderWidth: 1,
        }));

        setChartData({
          labels: labels,
          datasets: datasets,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    if (studio && token) {
      fetchData();
    }
  }, [studio, token]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Visites par mois',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return <Bar data={chartData} options={options} />;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default BarChart;
