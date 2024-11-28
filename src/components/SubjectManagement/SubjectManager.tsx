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
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { trash, add } from 'ionicons/icons';
import { useGradeStore } from '../../store/gradeStore';

export const SubjectManager: React.FC = () => {
  const { subjects, addSubject, deleteSubject } = useGradeStore();
  const [newSubject, setNewSubject] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState('');

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  const handleDeleteSubject = (subject: string) => {
    setSubjectToDelete(subject);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete);
    }
    setShowDeleteAlert(false);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Gestión de Asignaturas</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="flex gap-2 mb-4">
          <IonInput
            value={newSubject}
            placeholder="Nueva asignatura"
            onIonChange={e => setNewSubject(e.detail.value || '')}
            className="flex-1"
          />
          <IonButton onClick={handleAddSubject}>
            <IonIcon icon={add} slot="start" />
            Agregar
          </IonButton>
        </div>

        <IonList>
          {subjects.map(subject => (
            <IonItem key={subject}>
              <IonLabel>{subject}</IonLabel>
              {subject !== 'General' && (
                <IonButton
                  fill="clear"
                  color="danger"
                  slot="end"
                  onClick={() => handleDeleteSubject(subject)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta asignatura? Se eliminarán todas las notas asociadas."
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
      </IonCardContent>
    </IonCard>
  );
};