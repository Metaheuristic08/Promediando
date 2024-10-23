import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/react';
import { useGradeStore } from '../../store/gradeStore';

export const SubjectComparison: React.FC = () => {
  const { subjects, getSubjectStats } = useGradeStore();

  const subjectStats = subjects.map(subject => ({
    subject,
    ...getSubjectStats(subject),
  })).sort((a, b) => b.average - a.average);

  const getPerformanceColor = (average: number) => {
    if (average >= 6.0) return 'success';
    if (average >= 5.0) return 'primary';
    if (average >= 4.0) return 'warning';
    return 'danger';
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Comparativa de Asignaturas</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {subjectStats.map(({ subject, average, highest, lowest, count }) => (
            <IonItem key={subject}>
              <IonLabel>
                <h2>{subject}</h2>
                <p>
                  Mejor nota: {highest.toFixed(1)} | Peor nota: {lowest.toFixed(1)}
                </p>
                <p>Total evaluaciones: {count}</p>
              </IonLabel>
              <IonBadge slot="end" color={getPerformanceColor(average)}>
                {average.toFixed(1)}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};