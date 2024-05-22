import React from 'react';

import { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar ,Pie}            from 'react-chartjs-2'

const BarChart = ({ candidates }) => {
  const [chartInstance, setChartInstance] = useState(null);

  // Extracting candidate names and votes from the provided response
  const candidateNames = candidates.map(candidate => candidate[0]);
  const votes = candidates.map(candidate => parseInt(candidate[3]));

  
  const data = {
    labels: candidateNames,
    datasets: [
      {
        label: 'Number of Votes',
        data: votes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates]);

  return <Bar data={data} />;
};

const PieChart = ({ candidates }) => {
  const [chartInstance, setChartInstance] = useState(null);
  // Extracting candidate names and votes from the provided response
  const candidateNames = candidates.map(candidate => candidate[0]);
  const votes = candidates.map(candidate => parseInt(candidate[3]));
  const totalVotes = votes.reduce((total, vote) => total + vote, 0);
  const percentages = votes.map(vote => ((vote / totalVotes) * 100).toFixed(2));

  const data = {
    labels: candidateNames,
    datasets: [
      {
        label: 'Vote Percentage',
        data: percentages,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates]);

  return <Pie data={data} />;
};

export { BarChart, PieChart };
