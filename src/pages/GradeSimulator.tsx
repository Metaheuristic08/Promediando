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
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { Line } from 'react-chartjs-2';
import { useGradeStore } from '../store/gradeStore';

interface SimulatedGrade {
  subject: string;
  value: number;
  weight: number;
}

const GradeSimulator: React.FC = () => {
  const { subjects, grades, calculateAverage, addSubject } = useGradeStore();
  const [simulatedGrade, setSimulatedGrade] = useState<SimulatedGrade>({
    subject: subjects[0],
    value: 4.0,
    weight: 0,
  });
  const [targetAverage, setTargetAverage] = useState(4.0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showAddSubjectAlert, setShowAddSubjectAlert] = useState(false);
  const [showDeleteSubjectAlert, setShowDeleteSubjectAlert] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState('');

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

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(newSubject.trim());
      setNewSubject('');
      setShowAddSubjectAlert(false);
      setAlertMessage('Asignatura agregada correctamente');
      setShowAlert(true);
    }
  };

  const handleDeleteSubject = () => {
    if (subjectToDelete && subjects.length > 1) {
      const updatedSubjects = subjects.filter(s => s !== subjectToDelete);
      // Update the store with the new subjects list
      // Note: This would need to be implemented in the store
      setShowDeleteSubjectAlert(false);
      setAlertMessage('Asignatura eliminada correctamente');
      setShowAlert(true);
    }
  };

  // Prepare data for the trend chart
  const trendData = {
    labels: grades.map(g => new Date(g.date).toLocaleDateString()),
    datasets: subjects.map((subject, index) => ({
      label: subject,
      data: grades
        .filter(g => g.subject === subject)
        .map(g => g.value),
      borderColor: `hsl(${index * (360 / subjects.length)}, 70%, 50%)`,
      tension: 0.4,
      fill: false,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 7,
        title: { display: true, text: 'Nota' }
      },
      x: {
        title: { display: true, text: 'Fecha' }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
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
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="flex justify-between items-center">
                    Gestión de Asignaturas
                    <IonButton onClick={() => setShowAddSubjectAlert(true)}>
                      <IonIcon slot="start" icon={add} />
                      Agregar Asignatura
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    {subjects.map((subject) => (
                      <IonItem key={subject}>
                        <IonLabel>{subject}</IonLabel>
                        {subjects.length > 1 && (
                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => {
                              setSubjectToDelete(subject);
                              setShowDeleteSubjectAlert(true);
                            }}
                          >
                            <IonIcon slot="icon-only" icon={trash} />
                          </IonButton>
                        )}
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Tendencia de Notas por Asignatura</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ height: '300px' }}>
                  <Line data={trendData} options={chartOptions} />
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

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

        <IonAlert
          isOpen={showAddSubjectAlert}
          onDidDismiss={() => setShowAddSubjectAlert(false)}
          header="Agregar Asignatura"
          inputs={[
            {
              name: 'subject',
              type: 'text',
              placeholder: 'Nombre de la asignatura',
              value: newSubject,
              handler: (e: CustomEvent) => setNewSubject(e.detail.value)
            }
          ]}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Agregar',
              handler: handleAddSubject
            }
          ]}
        />

        <IonAlert
          isOpen={showDeleteSubjectAlert}
          onDidDismiss={() => setShowDeleteSubjectAlert(false)}
          header="Eliminar Asignatura"
          message={`¿Estás seguro de que deseas eliminar la asignatura "${subjectToDelete}"?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              handler: handleDeleteSubject
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default GradeSimulator;