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
  IonRefresher,
  IonRefresherContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { download } from 'ionicons/icons';
import { DetailedAnalysis } from '../components/Analysis/DetailedAnalysis';
import { PerformanceAnalysis } from '../components/Analysis/PerformanceAnalysis';
import { SubjectComparison } from '../components/Analysis/SubjectComparison';
import { GradeDistribution } from '../components/Analysis/GradeDistribution';
import { TrendAnalysis } from '../components/Analysis/TrendAnalysis';
import { useGradeStore } from '../store/gradeStore';
import { exportToPDF, generateGradeReport } from '../utils/export';

const Dashboard: React.FC = () => {
  const { grades, calculateAverage } = useGradeStore();

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  const handleExportReport = async () => {
    const report = generateGradeReport(grades);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-notas-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          <IonButton slot="end" onClick={handleExportReport}>
            <IonIcon icon={download} slot="start" />
            Exportar Reporte
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 className="text-2xl font-bold p-4">
                Promedio General: {calculateAverage().toFixed(2)}
              </h2>
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol size="12">
              <DetailedAnalysis />
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <GradeDistribution />
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <TrendAnalysis />
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
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;