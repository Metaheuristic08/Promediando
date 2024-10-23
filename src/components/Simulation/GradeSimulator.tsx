import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
} from '@ionic/react';
import { useGradeStore } from '../../store/gradeStore';

export const GradeSimulator: React.FC = () => {
  const [targetAverage, setTargetAverage] = useState(4.0);
  const [remainingWeight, setRemainingWeight] = useState(30);
  const { grades, calculateAverage } = useGradeStore();

  const calculateRequiredGrade = () => {
    const currentAverage = calculateAverage();
    const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
    const availableWeight = 100 - totalWeight;

    if (availableWeight <= 0) return null;

    const requiredGrade =
      (targetAverage * 100 - currentAverage * (100 - remainingWeight)) / remainingWeight;

    return Math.min(Math.max(requiredGrade, 1.0), 7.0);
  };

  const requiredGrade = calculateRequiredGrade();

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Simulador de Notas</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Promedio Deseado (1.0 - 7.0)</IonLabel>
            <IonInput
              type="number"
              value={targetAverage}
              onIonChange={e => setTargetAverage(parseFloat(e.detail.value!))}
              min="1.0"
              max="7.0"
              step="0.1"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Porcentaje Restante (%)</IonLabel>
            <IonInput
              type="number"
              value={remainingWeight}
              onIonChange={e => setRemainingWeight(parseFloat(e.detail.value!))}
              min="0"
              max="100"
            />
          </IonItem>
        </IonList>
        {requiredGrade !== null ? (
          <p className="ion-text-center ion-padding-top">
            Necesitas obtener un {requiredGrade.toFixed(1)} para alcanzar el promedio deseado
          </p>
        ) : (
          <p className="ion-text-center ion-padding-top">
            No hay porcentaje disponible para simular
          </p>
        )}
      </IonCardContent>
    </IonCard>
  );
};