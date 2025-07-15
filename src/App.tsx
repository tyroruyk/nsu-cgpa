import { Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CourseForm } from './components/CourseForm';
import { CourseList } from './components/CourseList';
import { DataManagement } from './components/DataManagement';
import { GpaDisplay } from './components/GpaDisplay';
import { Course } from './types';
import { calculateCGPA, groupCoursesBySemester } from './utils/calculations';

import { SEMESTERS } from './utils/gradeSystem';

const STORAGE_KEY = 'nsu-cgpa-courses';


function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  // Filter state
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterSemester, setFilterSemester] = useState<string>('All');

  // Load courses from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem(STORAGE_KEY);
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error('Failed to parse saved courses:', error);
      }
    }
  }, []);

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const importData = (importedCourses: Course[]) => {
    setCourses(importedCourses);
  };

  const cgpa = calculateCGPA(courses);
  const totalCredits = courses.reduce((sum, course) => sum + course.creditHour, 0);
  const semesters = groupCoursesBySemester(courses);

  // Get unique years from courses for filter dropdown
  const years = Array.from(new Set(courses.map(c => c.year))).sort((a, b) => b - a);

  // Filter courses based on year and semester
  const filteredCourses = courses.filter(course => {
    const yearMatch = filterYear === 'All' || course.year === Number(filterYear);
    const semesterMatch = filterSemester === 'All' || course.semester === filterSemester;
    return yearMatch && semesterMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/nsu-logo.png" alt="NSU Logo" className="w-10 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NSU CGPA Calculator</h1>
                <p className="text-gray-600">North South University Grade Point Calculator</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{courses.length} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{semesters.length} Semesters</span>
              </div>
            </div>
          </div>
          {/* Name and ID input fields */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="Your Student ID"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Management */}
          <div className="lg:col-span-2 space-y-6">
            <CourseForm onAddCourse={addCourse} />
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 mb-4 gap-2">
                <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
                <div className="flex gap-2 flex-wrap">
                  <label>
                    <span className="text-sm text-gray-600 mr-1">Year:</span>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={filterYear}
                      onChange={e => setFilterYear(e.target.value)}
                    >
                      <option value="All">All</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="text-sm text-gray-600 mr-1">Semester:</span>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={filterSemester}
                      onChange={e => setFilterSemester(e.target.value)}
                    >
                      <option value="All">All</option>
                      {SEMESTERS.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <CourseList courses={filteredCourses} onDeleteCourse={deleteCourse} />
            </div>
          </div>

          {/* Right Column - GPA Display and Data Management */}
          <div className="space-y-6">
            <GpaDisplay
              cgpa={cgpa}
              totalCredits={totalCredits}
              semesters={semesters}
            />
            
            <DataManagement
              courses={courses}
              cgpa={cgpa}
              totalCredits={totalCredits}
              name={name}
              studentId={studentId}
              onImportData={importData}
              setName={setName}
              setStudentId={setStudentId}
            />
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="md:hidden mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Courses</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Semesters</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{semesters.length}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built for North South University students • Follows NSU grading system
            </p>
            <p className="text-xs mt-1 text-gray-500">
              Grade Scale: A(4.0), A-(3.7), B+(3.3), B(3.0), B-(2.7), C+(2.3), C(2.0), C-(1.7), D+(1.3), D(1.0), F(0.0)
            </p>
            <p className="text-xs mt-2 text-gray-400">
              Powered by students of NSU • <a href="https://github.com/tyroruyk" target="_blank" rel="noopener noreferrer" className="underline">@tyroruyk</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
