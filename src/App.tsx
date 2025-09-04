import { Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CourseForm } from './components/CourseForm';
import { CourseList } from './components/CourseList';
import { DataManagement } from './components/DataManagement';
import { GpaDisplay } from './components/GpaDisplay';
import { Course } from './types';
import { calculateCGPA, computeProbationStage, groupCoursesBySemester } from './utils/calculations';

import { SEMESTERS } from './utils/gradeSystem';

const STORAGE_KEY = 'nsu-cgpa-courses';
const STORAGE_NAME_KEY = 'nsu-cgpa-name';
const STORAGE_ID_KEY = 'nsu-cgpa-id';
const STORAGE_PREV_CGPA = 'nsu-cgpa-prev-cgpa';
const STORAGE_PREV_CREDITS = 'nsu-cgpa-prev-credits';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [prevCgpa, setPrevCgpa] = useState('');
  const [prevCredits, setPrevCredits] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Filter state
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterSemester, setFilterSemester] = useState<string>('All');
  const [filterCourseName, setFilterCourseName] = useState<string>('');
  const [showGradingTable, setShowGradingTable] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem(STORAGE_KEY);
    const savedName = localStorage.getItem(STORAGE_NAME_KEY);
    const savedId = localStorage.getItem(STORAGE_ID_KEY);

    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error('Failed to parse saved courses:', error);
      }
    }
    if (savedName) setName(savedName);
    if (savedId) setStudentId(savedId);
    
    const savedPrevCgpa = localStorage.getItem(STORAGE_PREV_CGPA);
    const savedPrevCredits = localStorage.getItem(STORAGE_PREV_CREDITS);
    if (savedPrevCgpa) setPrevCgpa(savedPrevCgpa);
    if (savedPrevCredits) setPrevCredits(savedPrevCredits);
    
    setIsDataLoaded(true); // Mark data as loaded
  }, []);

  // Save courses to localStorage only after initial data is loaded
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses, isDataLoaded]);

  // Save name and studentId to localStorage
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_NAME_KEY, name);
    }
  }, [name, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_ID_KEY, studentId);
    }
  }, [studentId, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) localStorage.setItem(STORAGE_PREV_CGPA, prevCgpa);
  }, [prevCgpa, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) localStorage.setItem(STORAGE_PREV_CREDITS, prevCredits);
  }, [prevCredits, isDataLoaded]);

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

  const cgpa = calculateCGPA(courses, Number(prevCgpa), Number(prevCredits));
  const totalCredits = courses.reduce((sum, course) => sum + course.creditHour, 0);
  const semesters = groupCoursesBySemester(courses);
  const probation = computeProbationStage(semesters, cgpa, prevCgpa ? Number(prevCgpa) : undefined);

  // Get unique years from courses for filter dropdown
  const years = Array.from(new Set(courses.map(c => c.year))).sort((a, b) => b - a);

  // Filter courses based on year, semester, and course name
  const filteredCourses = courses.filter(course => {
    const yearMatch = filterYear === 'All' || course.year === Number(filterYear);
    const semesterMatch = filterSemester === 'All' || course.semester === filterSemester;
    const courseNameMatch = filterCourseName === '' || course.name.toLowerCase().includes(filterCourseName.toLowerCase())
    return yearMatch && semesterMatch && courseNameMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/nsu-cgpa/nsu-logo.png" alt="NSU Logo" className="w-10 object-contain" />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous CGPA</label>
              <input
                type="number"
                value={prevCgpa}
                onChange={e => setPrevCgpa(e.target.value)}
                step="0.01"
                min="0"
                max="4"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="e.g. 3.25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Credits</label>
              <input
                type="number"
                value={prevCredits}
                onChange={e => setPrevCredits(e.target.value)}
                step="1"
                min="0"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="e.g. 60"
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
                  <label>
                    <span className="text-sm text-gray-600 mr-1">Course:</span>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 text-sm w-32"
                      placeholder="Search..."
                      value={filterCourseName}
                      onChange={e => setFilterCourseName(e.target.value)}
                    />
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
              totalCredits={totalCredits + (parseInt(prevCredits) || 0)}
              semesters={semesters}
              probation={probation}
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
              prevCgpa={prevCgpa}
              prevCredits={prevCredits}
              setPrevCgpa={setPrevCgpa}
              setPrevCredits={setPrevCredits}
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
      
      {/* Grading Table */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 align-middle text-center">
        <button
          onClick={() => setShowGradingTable(prev => !prev)}
          className="text-blue-600 font-medium hover:underline focus:outline-none"
        >
          {showGradingTable ? 'Hide Grading Table ▲' : 'Show Grading Table ▼'}
        </button>

        {showGradingTable && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-lg font-bold text-white mb-4 text-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
              NSU Grading Policy
            </h2>
            <table className="min-w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-200 text-gray-900">
                <tr>
                  <th className="border px-4 py-2">Scores</th>
                  <th className="border px-4 py-2">Grade</th>
                  <th className="border px-4 py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-green-100 text-green-900 font-semibold"><td className="border px-4 py-2">93+</td><td className="border px-4 py-2">A Excellent</td><td className="border px-4 py-2">4.0</td></tr>
                <tr className="bg-green-50 text-green-800"><td className="border px-4 py-2">90 - 92</td><td className="border px-4 py-2">A-</td><td className="border px-4 py-2">3.7</td></tr>
                <tr className="bg-lime-100 text-lime-900"><td className="border px-4 py-2">87 - 89</td><td className="border px-4 py-2">B+</td><td className="border px-4 py-2">3.3</td></tr>
                <tr className="bg-lime-50 text-lime-800"><td className="border px-4 py-2">83 - 86</td><td className="border px-4 py-2">B Good</td><td className="border px-4 py-2">3.0</td></tr>
                <tr className="bg-yellow-100 text-yellow-900"><td className="border px-4 py-2">80 - 82</td><td className="border px-4 py-2">B-</td><td className="border px-4 py-2">2.7</td></tr>
                <tr className="bg-yellow-50 text-yellow-800"><td className="border px-4 py-2">77 - 79</td><td className="border px-4 py-2">C+</td><td className="border px-4 py-2">2.3</td></tr>
                <tr className="bg-orange-100 text-orange-900"><td className="border px-4 py-2">73 - 76</td><td className="border px-4 py-2">C Average</td><td className="border px-4 py-2">2.0</td></tr>
                <tr className="bg-orange-50 text-orange-800"><td className="border px-4 py-2">70 - 72</td><td className="border px-4 py-2">C-</td><td className="border px-4 py-2">1.7</td></tr>
                <tr className="bg-red-100 text-red-900"><td className="border px-4 py-2">67 - 69</td><td className="border px-4 py-2">D+</td><td className="border px-4 py-2">1.3</td></tr>
                <tr className="bg-red-50 text-red-800"><td className="border px-4 py-2">60 - 66</td><td className="border px-4 py-2">D Poor</td><td className="border px-4 py-2">1.0</td></tr>
                <tr className="bg-gray-300 text-gray-800 font-semibold"><td className="border px-4 py-2">Below 60</td><td className="border px-4 py-2">F* Failure</td><td className="border px-4 py-2">0.0</td></tr>
                <tr className="bg-gray-100 text-gray-700"><td className="border px-4 py-2">—</td><td className="border px-4 py-2">I** Incomplete</td><td className="border px-4 py-2">0.0</td></tr>
                <tr className="bg-gray-100 text-gray-700"><td className="border px-4 py-2">—</td><td className="border px-4 py-2">W** Withdrawal</td><td className="border px-4 py-2">0.0</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built for North South University students • Follows NSU grading system
            </p>
            <p className="text-xs mt-1 text-gray-400">
              Powered by students of NSU • <a href="https://github.com/tyroruyk" target="_blank" rel="noopener noreferrer" className="underline">@tyroruyk</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
