import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from '@ionic/react';
import { useGradeStore } from '../store/gradeStore';

interface SimulatedGrade {
  subject: string;
  value: number;
  weight: number;
}

const GradeSimulator: React.FC = () => {
  const { subjects, grades, calculateAverage } = useGradeStore();
  const [simulatedGrade, setSimulatedGrade] = useState<SimulatedGrade>({
    subject: subjects[0],
    value: 4.0,
    weight: 0,
  });
  const [targetAverage, setTargetAverage] = useState(4.0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const calculateSimulatedAverage = () => {
    const currentGrades = [...grades];
    const totalWeight = currentGrades.reduce((sum, g) => sum + g.weight, 0) + simulatedGrade.weight;

    if (totalWeight > 100) {
      setAlertMessage('El peso total no puede exceder el 100%');
      setShowAlert(true);
      return null;
    }

    if (simulatedGrade.value < 1.0 || simulatedGrade.value > 7.0) {
      setAlertMessage('La nota debe estar entre 1.0 y 7.0');
      setShowAlert(true);
      return null;
    }

    const weightedSum = currentGrades.reduce(
      (sum, g) => sum + g.value * g.weight,
      0
    ) + simulatedGrade.value * simulatedGrade.weight;

    return weightedSum / totalWeight;
  };

  const calculateRequiredGrade = () => {
    const currentAverage = calculateAverage();
    const remainingWeight = 100 - grades.reduce((sum, g) => sum + g.weight, 0);

    if (remainingWeight <= 0) {
      setAlertMessage('No hay porcentaje disponible para simular');
      setShowAlert(true);
      return null;
    }

    const requiredGrade = (targetAverage * 100 - currentAverage * (100 - remainingWeight)) / remainingWeight;
    return Math.min(Math.max(requiredGrade, 1.0), 7.0);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Simulador de Notas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Simular Nueva Nota</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel position="stacked">Asignatura</IonLabel>
                      <IonSelect
                        value={simulatedGrade.subject}
                        onIonChange={e => setSimulatedGrade({
                          ...simulatedGrade,
                          subject: e.detail.value,
                        })}
                      >
                        {subjects.map(subject => (
                          <IonSelectOption key={subject} value={subject}>
                            {subject}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Nota (1.0 - 7.0)</IonLabel>
                      <IonInput
                        type="number"
                        value={simulatedGrade.value}
                        onIonChange={e => setSimulatedGrade({
                          ...simulatedGrade,
                          value: parseFloat(e.detail.value!),
                        })}
                        min="1.0"
                        max="7.0"
                        step="0.1"
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Porcentaje (%)</IonLabel>
                      <IonInput
                        type="number"
                        value={simulatedGrade.weight}
                        onIonChange={e => setSimulatedGrade({
                          ...simulatedGrade,
                          weight: parseFloat(e.detail.value!),
                        })}
                        min="0"
                        max="100"
                      />
                    </IonItem>
                  </IonList>
                  <IonButton
                    expand="block"
                    onClick={() => {
                      const average = calculateSimulatedAverage();
                      if (average !== null) {
                        setAlertMessage(`Promedio simulado: ${average.toFixed(1)}`);
                        setShowAlert(true);
                      }
                    }}
                  >
                    Calcular Promedio Simulado
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Calcular Nota Necesaria</IonCardTitle>
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
                  </IonList>
                  <IonButton
                    expand="block"
                    onClick={() => {
                      const required = calculateRequiredGrade();
                      if (required !== null) {
                        setAlertMessage(`Nota necesaria: ${required.toFixed(1)}`);
                        setShowAlert(true);
                      }
                    }}
                  >
                    Calcular Nota Necesaria
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Resultado"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default GradeSimulator;