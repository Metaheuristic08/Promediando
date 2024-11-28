import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Grade, GradeStats } from '../types/grade';

interface GradeStore {
  grades: Grade[];
  subjects: string[];
  addGrade: (grade: Omit<Grade, 'id'>) => boolean;
  updateGrade: (id: string, grade: Partial<Grade>) => boolean;
  deleteGrade: (id: string) => void;
  addSubject: (subject: string) => void;
  deleteSubject: (subject: string) => void;
  calculateAverage: (subject?: string) => number;
  getSubjectStats: (subject: string) => GradeStats;
  exportData: () => string;
  importData: (data: string) => void;
  getTotalPercentage: () => number;
  getRemainingPercentage: () => number;
  canAddGrade: () => boolean;
}

export const useGradeStore = create<GradeStore>()(
  persist(
    (set, get) => ({
      grades: [],
      subjects: ['General'],

      addGrade: (grade) => {
        const { grades } = get();
        const totalPercentage = grades.reduce((sum, g) => sum + g.weight, 0);
        
        if (totalPercentage + grade.weight > 100) {
          return false;
        }

        if (grade.value < 1.0 || grade.value > 7.0) {
          return false;
        }

        const newGrade = { ...grade, id: crypto.randomUUID() };
        set((state) => ({ grades: [...state.grades, newGrade] }));
        return true;
      },

      updateGrade: (id, grade) => {
        const { grades } = get();
        const currentGrade = grades.find(g => g.id === id);
        if (!currentGrade) return false;

        const otherGrades = grades.filter(g => g.id !== id);
        const totalPercentage = otherGrades.reduce((sum, g) => sum + g.weight, 0);
        
        if (grade.weight !== undefined && totalPercentage + grade.weight > 100) {
          return false;
        }

        if (grade.value !== undefined && (grade.value < 1.0 || grade.value > 7.0)) {
          return false;
        }

        set((state) => ({
          grades: state.grades.map((g) => (g.id === id ? { ...g, ...grade } : g)),
        }));
        return true;
      },

      deleteGrade: (id) => {
        set((state) => ({
          grades: state.grades.filter((g) => g.id !== id),
        }));
      },

      addSubject: (subject) => {
        set((state) => ({
          subjects: [...new Set([...state.subjects, subject])],
        }));
      },

      deleteSubject: (subject) => {
        set((state) => ({
          subjects: state.subjects.filter(s => s !== subject),
          grades: state.grades.filter(g => g.subject !== subject),
        }));
      },

      calculateAverage: (subject) => {
        const { grades } = get();
        const filteredGrades = subject
          ? grades.filter((g) => g.subject === subject)
          : grades;

        if (filteredGrades.length === 0) return 0;

        const totalWeight = filteredGrades.reduce((sum, grade) => sum + grade.weight, 0);
        const weightedSum = filteredGrades.reduce(
          (sum, grade) => sum + grade.value * grade.weight,
          0
        );

        return totalWeight === 0 ? 0 : Number((weightedSum / totalWeight).toFixed(2));
      },

      getSubjectStats: (subject) => {
        const { grades } = get();
        const subjectGrades = grades.filter((g) => g.subject === subject);

        if (subjectGrades.length === 0) {
          return { average: 0, highest: 0, lowest: 0, count: 0 };
        }

        const values = subjectGrades.map((g) => g.value);
        return {
          average: get().calculateAverage(subject),
          highest: Math.max(...values),
          lowest: Math.min(...values),
          count: subjectGrades.length,
        };
      },

      exportData: () => {
        const { grades, subjects } = get();
        return JSON.stringify({ grades, subjects });
      },

      importData: (data) => {
        try {
          const { grades, subjects } = JSON.parse(data);
          set({ grades, subjects });
        } catch (error) {
          console.error('Error importing data:', error);
        }
      },

      getTotalPercentage: () => {
        const { grades } = get();
        return grades.reduce((sum, grade) => sum + grade.weight, 0);
      },

      getRemainingPercentage: () => {
        return 100 - get().getTotalPercentage();
      },

      canAddGrade: () => {
        const { grades } = get();
        return grades.length < 10;
      },
    }),
    {
      name: 'grade-storage',
    }
  )
);