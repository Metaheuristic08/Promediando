import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Grade } from '../../types/grade';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GradeChartProps {
  grades: Grade[];
  type: 'bar' | 'line';
  subject?: string;
}

export const GradeChart: React.FC<GradeChartProps> = ({ grades, type, subject }) => {
  const filteredGrades = subject
    ? grades.filter(grade => grade.subject === subject)
    : grades;

  const data = {
    labels: filteredGrades.map(g => g.name),
    datasets: [
      {
        label: 'Notas',
        data: filteredGrades.map(g => g.value),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: subject ? `Notas de ${subject}` : 'Todas las Notas',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 7,
      },
    },
  };

  const ChartComponent = type === 'bar' ? Bar : Line;

  return <ChartComponent data={data} options={options} />;
};