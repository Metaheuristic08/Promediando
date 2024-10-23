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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAlert,
} from '@ionic/react';
import { trash, create } from 'ionicons/icons';
import { GradeForm, GradeFormData } from '../components/GradeInput/GradeForm';
import { useGradeStore } from '../store/gradeStore';

const GradeManagement: React.FC = () => {
  const { grades, subjects, addGrade, deleteGrade } = useGradeStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<string | null>(null);

  const handleSubmit = (data: GradeFormData) => {
    addGrade(data);
  };

  const handleDelete = (id: string) => {
    setGradeToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (gradeToDelete) {
      deleteGrade(gradeToDelete);
      setGradeToDelete(null);
    }
    setShowDeleteAlert(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestión de Notas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Agregar Nueva Nota</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <GradeForm onSubmit={handleSubmit} subjects={subjects} />
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Notas Registradas</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    {grades.map((grade) => (
                      <IonItem key={grade.id}>
                        <IonLabel>
                          <h2>{grade.name}</h2>
                          <p>
                            {grade.subject} - Nota: {grade.value} ({grade.weight}%)
                          </p>
                        </IonLabel>
                        <IonButton
                          fill="clear"
                          slot="end"
                          onClick={() => handleDelete(grade.id)}
                        >
                          <IonIcon icon={trash} />
                        </IonButton>
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta nota?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default GradeManagement;