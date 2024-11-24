import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { Line } from 'react-chartjs-2';
import { useGradeStore } from '../../store/gradeStore';
import '../Charts/ChartConfig';

export const TrendAnalysis: React.FC = () => {
  const { grades } = useGradeStore();

  const calculateMovingAverage = (grades: typeof grades, window: number = 3) => {
    const sortedGrades = [...grades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sortedGrades.map((_, index, array) => {
      const start = Math.max(0, index - window + 1);
      const windowGrades = array.slice(start, index + 1);
      const average = windowGrades.reduce((sum, g) => sum + g.value, 0) / windowGrades.length;
      return {
        date: array[index].date,
        value: Number(average.toFixed(2))
      };
    });
  };

  const sortedGrades = [...grades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = {
    labels: sortedGrades.map(g => new Date(g.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Notas',
        data: sortedGrades.map(g => g.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointRadius: 4,
      },
      {
        label: 'Tendencia (Media Móvil)',
        data: calculateMovingAverage(grades).map(g => g.value),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Análisis de Tendencia'
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        min: 1,
        max: 7,
        title: {
          display: true,
          text: 'Nota'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Análisis de Tendencia</IonCardTitle>
      </IonCardHeader>
      <IonCardContent style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
};