import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { GradeChart } from '../components/Charts/GradeChart';
import { PerformanceAnalysis } from '../components/Analysis/PerformanceAnalysis';
import { SubjectComparison } from '../components/Analysis/SubjectComparison';
import { useGradeStore } from '../store/gradeStore';

const Dashboard: React.FC = () => {
  const { grades, calculateAverage } = useGradeStore();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 className="ion-padding-horizontal">
                Promedio General: {calculateAverage().toFixed(1)}
              </h2>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <PerformanceAnalysis />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <SubjectComparison />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <GradeChart grades={grades} type="bar" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;