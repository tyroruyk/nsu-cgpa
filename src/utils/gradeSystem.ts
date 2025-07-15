import { Grade } from '../types';

export const GRADE_POINTS: Record<Grade, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export const GRADES: Grade[] = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

export const SEMESTERS = ['Spring', 'Summer', 'Fall'] as const;

export const getGradeColor = (grade: Grade): string => {
  const colors: Record<Grade, string> = {
    'A': 'text-green-600',
    'A-': 'text-green-500',
    'B+': 'text-blue-600',
    'B': 'text-blue-500',
    'B-': 'text-blue-400',
    'C+': 'text-yellow-600',
    'C': 'text-yellow-500',
    'C-': 'text-yellow-400',
    'D+': 'text-orange-600',
    'D': 'text-orange-500',
    'F': 'text-red-600',
  };
  return colors[grade];
};

export const getGPAColor = (gpa: number): string => {
  if (gpa >= 3.7) return 'text-green-600';
  if (gpa >= 3.3) return 'text-blue-600';
  if (gpa >= 3.0) return 'text-yellow-600';
  if (gpa >= 2.0) return 'text-orange-600';
  return 'text-red-600';
};