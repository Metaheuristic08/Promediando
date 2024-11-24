import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { Bar } from 'react-chartjs-2';
import { useGradeStore } from '../../store/gradeStore';
import '../Charts/ChartConfig';

export const GradeDistribution: React.FC = () => {
  const { grades } = useGradeStore();

  const ranges = [
    { min: 1.0, max: 2.0, label: '1.0-2.0' },
    { min: 2.1, max: 3.0, label: '2.1-3.0' },
    { min: 3.1, max: 4.0, label: '3.1-4.0' },
    { min: 4.1, max: 5.0, label: '4.1-5.0' },
    { min: 5.1, max: 6.0, label: '5.1-6.0' },
    { min: 6.1, max: 7.0, label: '6.1-7.0' },
  ];

  const distribution = ranges.map(range => ({
    ...range,
    count: grades.filter(g => g.value >= range.min && g.value <= range.max).length
  }));

  const data = {
    labels: distribution.map(d => d.label),
    datasets: [{
      label: 'Distribución de Notas',
      data: distribution.map(d => d.count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const count = context.raw;
            const percentage = ((count / grades.length) * 100).toFixed(1);
            return `${count} notas (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Distribución de Notas</IonCardTitle>
      </IonCardHeader>
      <IonCardContent style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
};