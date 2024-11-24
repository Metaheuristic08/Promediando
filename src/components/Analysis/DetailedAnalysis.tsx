import React, { useMemo, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { Line, Bar } from 'react-chartjs-2';
import { download } from 'ionicons/icons';
import { useGradeStore } from '../../store/gradeStore';
import { exportToPDF, exportToImage } from '../../utils/export';
import '../Charts/ChartConfig';

export const DetailedAnalysis: React.FC = () => {
  const { grades, subjects, getSubjectStats } = useGradeStore();

  const subjectData = useMemo(() => {
    return subjects.map(subject => ({
      subject,
      stats: getSubjectStats(subject),
      grades: grades.filter(g => g.subject === subject)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }));
  }, [grades, subjects, getSubjectStats]);

  const trendData = {
    labels: subjectData[0]?.grades.map(g => new Date(g.date).toLocaleDateString()) || [],
    datasets: subjects.map((subject, index) => ({
      label: subject,
      data: subjectData[index].grades.map(g => g.value),
      borderColor: `hsl(${index * (360 / subjects.length)}, 70%, 50%)`,
      tension: 0.4,
      fill: false,
    })),
  };

  const comparisonData = {
    labels: subjects,
    datasets: [{
      label: 'Promedio por Asignatura',
      data: subjects.map(subject => getSubjectStats(subject).average),
      backgroundColor: subjects.map((_, index) => 
        `hsla(${index * (360 / subjects.length)}, 70%, 50%, 0.7)`
      ),
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 7,
        title: { display: true, text: 'Nota' }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  const handleExport = async (format: 'pdf' | 'image') => {
    const elementId = 'detailed-analysis';
    const filename = `analisis-detallado-${new Date().toISOString().split('T')[0]}`;
    
    try {
      if (format === 'pdf') {
        await exportToPDF(elementId, filename);
      } else {
        await exportToImage(elementId, filename);
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
    }
  };

  return (
    <div id="detailed-analysis">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle className="flex justify-between items-center">
            Análisis Detallado
            <div>
              <IonButton onClick={() => handleExport('pdf')}>
                <IonIcon icon={download} slot="start" />
                PDF
              </IonButton>
              <IonButton onClick={() => handleExport('image')}>
                <IonIcon icon={download} slot="start" />
                Imagen
              </IonButton>
            </div>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="12" style={{ height: '300px' }}>
                <h3>Evolución Temporal</h3>
                <Line data={trendData} options={chartOptions} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" style={{ height: '300px' }}>
                <h3>Comparativa de Asignaturas</h3>
                <Bar data={comparisonData} options={chartOptions} />
              </IonCol>
            </IonRow>
            <IonRow>
              {subjectData.map(({ subject, stats, grades }) => (
                <IonCol size="12" sizeMd="6" key={subject}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{subject}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>Promedio: {stats.average.toFixed(2)}</p>
                      <p>Nota más alta: {stats.highest}</p>
                      <p>Nota más baja: {stats.lowest}</p>
                      <p>Total evaluaciones: {stats.count}</p>
                      <p>Tendencia: {
                        grades.length > 1 
                          ? grades[grades.length - 1].value > grades[grades.length - 2].value 
                            ? '↑ Mejorando' 
                            : '↓ Descendiendo'
                          : 'Sin datos suficientes'
                      }</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
};