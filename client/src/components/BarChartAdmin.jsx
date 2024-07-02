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
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const getStats = async token => {
  const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + token,
    },
  });
  const stats = await response.json();
  return stats;
};

const BarChartAdmin = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getStats(token);

        const allYearsSet = new Set();
        stats['hydra:member'].forEach(company => {
          const yearsData = company.years;
          Object.keys(yearsData).forEach(year => {
            allYearsSet.add(year);
          });
        });

        const allYears = Array.from(allYearsSet).sort();

        const datasets = stats['hydra:member'].map(company => {
          const companyName = company.name;
          const yearsData = company.years;
          const data = allYears.map(year => {
            return yearsData[year] ? yearsData[year].totalCA : 0;
          });

          return {
            label: companyName,
            data: data,
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
            borderWidth: 1,
          };
        });

        setChartData({
          labels: allYears,
          datasets: datasets,
        });
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
        text: t('profile.chart-admin'),
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

export default BarChartAdmin;
