export interface Course {
  id: string;
  name: string;
  creditHour: number;
  grade: Grade;
  year: number;
  semester: 'Spring' | 'Summer' | 'Fall';
}

export type Grade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export interface SemesterData {
  year: number;
  semester: 'Spring' | 'Summer' | 'Fall';
  courses: Course[];
  gpa: number;
  totalCredits: number;
}

export interface AcademicData {
  name: string;
  studentId: string;
  courses: Course[];
  cgpa: number;
  totalCredits: number;
  semesters: SemesterData[];
}
