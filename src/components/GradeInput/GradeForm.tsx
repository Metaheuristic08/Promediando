import React from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { useGradeStore } from '../../store/gradeStore';

interface GradeFormProps {
  onSubmit: (data: GradeFormData) => void;
  subjects: string[];
}

export interface GradeFormData {
  name: string;
  value: number;
  weight: number;
  subject: string;
  date: string;
}

export const GradeForm: React.FC<GradeFormProps> = ({ onSubmit, subjects }) => {
  const { getTotalPercentage, canAddGrade } = useGradeStore();
  const remainingPercentage = 100 - getTotalPercentage();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<GradeFormData>({
    defaultValues: {
      name: '',
      value: 1.0,
      weight: 0,
      subject: subjects[0],
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmitForm = (data: GradeFormData) => {
    if (!canAddGrade()) {
      alert('Has alcanzado el límite máximo de 10 notas');
      return;
    }

    if (data.weight > remainingPercentage) {
      alert(`El porcentaje máximo disponible es ${remainingPercentage}%`);
      return;
    }

    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Asignatura</IonLabel>
          <Controller
            name="subject"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <IonSelect {...field}>
                {subjects.map((subject) => (
                  <IonSelectOption key={subject} value={subject}>
                    {subject}
                  </IonSelectOption>
                ))}
              </IonSelect>
            )}
          />
          {errors.subject && (
            <IonText color="danger">{errors.subject.message}</IonText>
          )}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Nombre de la Evaluación</IonLabel>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <IonInput {...field} placeholder="Ej: Prueba 1" />
            )}
          />
          {errors.name && (
            <IonText color="danger">{errors.name.message}</IonText>
          )}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Nota (1.0 - 7.0)</IonLabel>
          <Controller
            name="value"
            control={control}
            rules={{
              required: 'Este campo es requerido',
              min: { value: 1.0, message: 'La nota mínima es 1.0' },
              max: { value: 7.0, message: 'La nota máxima es 7.0' },
            }}
            render={({ field }) => (
              <IonInput
                {...field}
                type="number"
                min="1.0"
                max="7.0"
                step="0.1"
              />
            )}
          />
          {errors.value && (
            <IonText color="danger">{errors.value.message}</IonText>
          )}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Porcentaje (%) - Disponible: {remainingPercentage}%
          </IonLabel>
          <Controller
            name="weight"
            control={control}
            rules={{
              required: 'Este campo es requerido',
              min: { value: 0, message: 'El porcentaje mínimo es 0' },
              max: { value: remainingPercentage, message: `El porcentaje máximo es ${remainingPercentage}%` },
            }}
            render={({ field }) => (
              <IonInput
                {...field}
                type="number"
                min="0"
                max={remainingPercentage}
              />
            )}
          />
          {errors.weight && (
            <IonText color="danger">{errors.weight.message}</IonText>
          )}
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Fecha</IonLabel>
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <IonInput {...field} type="date" />
            )}
          />
          {errors.date && (
            <IonText color="danger">{errors.date.message}</IonText>
          )}
        </IonItem>
      </IonList>

      <IonButton
        expand="block"
        type="submit"
        disabled={!canAddGrade() || remainingPercentage <= 0}
      >
        Agregar Nota
      </IonButton>

      {!canAddGrade() && (
        <IonText color="danger" className="ion-text-center">
          <p>Has alcanzado el límite máximo de 10 notas</p>
        </IonText>
      )}
    </form>
  );
};