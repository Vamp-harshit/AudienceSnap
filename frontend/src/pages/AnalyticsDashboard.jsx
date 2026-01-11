import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard({ analytics }) {
  const { clicksPerLink, totalClicks, clicksOverTime, activeLinks } = analytics;

  // Bar chart data for clicks per link
  const barData = {
    labels: clicksPerLink.map(link => link.title),
    datasets: [
      {
        label: 'Clicks per Link',
        data: clicksPerLink.map(link => link.clicks),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  // Line chart data for clicks over time
  const lineData = {
    labels: clicksOverTime.map(item =>
      new Date(item.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Clicks Over Time',
        data: clicksOverTime.map(item => item.clicks),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <h2>Analytics Dashboard</h2>
      <div>
        <strong>Total Clicks:</strong> {totalClicks}
      </div>
      <div>
        <strong>Active Links:</strong> {activeLinks}
      </div>

      <div style={{ marginTop: '40px' }}>
        <Bar data={barData} />
      </div>

      <div style={{ marginTop: '40px' }}>
        <Line data={lineData} />
      </div>
    </div>
  );
}
