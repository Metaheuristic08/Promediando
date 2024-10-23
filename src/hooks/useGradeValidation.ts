import { useState, useEffect } from 'react';
import { Grade } from '../types/grade';

export const useGradeValidation = (grades: Grade[]) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    validateGrades(grades);
  }, [grades]);

  const validateGrades = (grades: Grade[]) => {
    // Validate total percentage
    const totalPercentage = grades.reduce((sum, grade) => sum + grade.weight, 0);
    if (totalPercentage > 100) {
      setIsValid(false);
      setValidationMessage('El total de porcentajes no puede superar el 100%');
      return;
    }

    // Validate grade values
    const invalidGrades = grades.filter(
      grade => grade.value < 1.0 || grade.value > 7.0
    );
    if (invalidGrades.length > 0) {
      setIsValid(false);
      setValidationMessage('Todas las notas deben estar entre 1.0 y 7.0');
      return;
    }

    setIsValid(true);
    setValidationMessage('');
  };

  return { isValid, validationMessage };
};