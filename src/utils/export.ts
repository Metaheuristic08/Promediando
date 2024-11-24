import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Grade } from '../types/grade';

export const exportToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

export const exportToImage = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting to image:', error);
    throw error;
  }
};

export const generateGradeReport = (grades: Grade[]) => {
  const subjects = [...new Set(grades.map(g => g.subject))];
  let report = 'Reporte de Calificaciones\n\n';

  subjects.forEach(subject => {
    const subjectGrades = grades.filter(g => g.subject === subject);
    const average = subjectGrades.reduce((sum, g) => sum + g.value * g.weight, 0) / 
                   subjectGrades.reduce((sum, g) => sum + g.weight, 0);

    report += `${subject}\n`;
    report += '------------------------\n';
    subjectGrades.forEach(g => {
      report += `${g.name}: ${g.value} (${g.weight}%)\n`;
    });
    report += `Promedio: ${average.toFixed(2)}\n\n`;
  });

  return report;
};