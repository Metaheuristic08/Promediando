import { useState, useEffect } from 'react';
import { Grade } from '../types/grade';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const useGradeValidation = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: ''
  });

  const validateGrade = (grade: Partial<Grade>, existingGrades: Grade[]): ValidationResult => {
    // Validate grade value
    if (grade.value !== undefined) {
      if (grade.value < 1.0 || grade.value > 7.0) {
        return {
          isValid: false,
          message: 'La nota debe estar entre 1.0 y 7.0'
        };
      }
    }

    // Validate weight
    if (grade.weight !== undefined) {
      const currentTotal = existingGrades.reduce((sum, g) => sum + g.weight, 0);
      const newTotal = currentTotal + grade.weight;

      if (newTotal > 100) {
        return {
          isValid: false,
          message: `El porcentaje total no puede superar 100%. Disponible: ${100 - currentTotal}%`
        };
      }
    }

    return { isValid: true, message: '' };
  };

  const validateGrades = (grades: Grade[]): ValidationResult => {
    // Check total percentage
    const totalPercentage = grades.reduce((sum, grade) => sum + grade.weight, 0);
    if (totalPercentage > 100) {
      return {
        isValid: false,
        message: 'El total de porcentajes supera el 100%'
      };
    }

    // Check grade values
    const invalidGrade = grades.find(grade => grade.value < 1.0 || grade.value > 7.0);
    if (invalidGrade) {
      return {
        isValid: false,
        message: 'Todas las notas deben estar entre 1.0 y 7.0'
      };
    }

    return { isValid: true, message: '' };
  };

  return {
    validateGrade,
    validateGrades,
    validationResult
  };
};