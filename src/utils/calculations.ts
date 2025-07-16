import { Course, SemesterData } from '../types';
import { GRADE_POINTS } from './gradeSystem';

export const calculateSemesterGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  
  const totalGradePoints = courses.reduce((sum, course) => {
    return sum + (GRADE_POINTS[course.grade] * course.creditHour);
  }, 0);
  
  const totalCredits = courses.reduce((sum, course) => sum + course.creditHour, 0);
  
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
};

export const calculateCGPA = (courses: Course[]): number => {
  return calculateSemesterGPA(courses);
};

export const groupCoursesBySemester = (courses: Course[]): SemesterData[] => {
  const grouped = courses.reduce((acc, course) => {
    const key = `${course.year}-${course.semester}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return Object.entries(grouped)
    .map(([key, semesterCourses]) => {
      const [year, semester] = key.split('-');
      const gpa = calculateSemesterGPA(semesterCourses);
      const totalCredits = semesterCourses.reduce((sum, course) => sum + course.creditHour, 0);
      
      return {
        year: parseInt(year),
        semester: semester as 'Spring' | 'Summer' | 'Fall',
        courses: semesterCourses,
        gpa,
        totalCredits,
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      
      const semesterOrder = { Spring: 1, Summer: 2, Fall: 3 };
      return semesterOrder[a.semester] - semesterOrder[b.semester];
    });
};

export const formatGPA = (gpa: number): string => {
  return gpa.toFixed(2);
};
