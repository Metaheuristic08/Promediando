import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { Line } from 'react-chartjs-2';
import { useGradeStore } from '../../store/gradeStore';

export const PerformanceAnalysis: React.FC = () => {
  const { grades, subjects } = useGradeStore();

  const getGradesByDate = (subject?: string) => {
    const filteredGrades = subject
      ? grades.filter(g => g.subject === subject)
      : grades;

    return filteredGrades.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const data = {
    labels: getGradesByDate().map(g => new Date(g.date).toLocaleDateString()),
    datasets: subjects.map((subject, index) => ({
      label: subject,
      data: getGradesByDate(subject).map(g => g.value),
      borderColor: `hsl(${index * (360 / subjects.length)}, 70%, 50%)`,
      tension: 0.4,
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución del Rendimiento por Asignatura',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 7,
        title: {
          display: true,
          text: 'Nota',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
    },
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Análisis de Rendimiento</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <Line data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
};