import React from 'react';
import { TrendingUp, Award, BookOpen } from 'lucide-react';
import { SemesterData } from '../types';
import { formatGPA } from '../utils/calculations';
import { getGPAColor } from '../utils/gradeSystem';

interface GpaDisplayProps {
  cgpa: number;
  totalCredits: number;
  semesters: SemesterData[];
}

const getGpaCommentStyle = (cgpa: number) => {
  if (cgpa === 0) return 'from-gray-400 to-gray-500';
  if (cgpa < 2) return 'from-red-500 to-red-700';
  if (cgpa < 2.5) return 'from-yellow-400 to-yellow-600';
  if (cgpa < 3) return 'from-blue-400 to-blue-600';
  if (cgpa < 3.5) return 'from-green-400 to-green-600';
  return 'from-emerald-500 to-emerald-700';
};

export const GpaDisplay: React.FC<GpaDisplayProps> = ({ cgpa, totalCredits, semesters }) => {
  return (
    <div className="space-y-6">
      {/* Overall CGPA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6" />
              <h2 className="text-xl font-bold">Overall CGPA</h2>
            </div>
            <p className="text-3xl font-bold">{formatGPA(cgpa)}</p>
            <p className="text-blue-100 mt-1">
              {totalCredits} Total Credits Completed
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-full p-3">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* CGPA Comment Card */}
      <div
        className={`bg-gradient-to-r ${getGpaCommentStyle(cgpa)} text-white p-4 rounded-lg shadow-md`}
      >
        <p className="text-sm font-medium">
          {semesters.length === 0 && cgpa === 0 ? (
            <span>No GPA recorded yet. Start your academic journey!</span>
          ) : cgpa < 2 ? (
            <span>⚠️ On Probation – You need to improve your GPA to avoid academic penalties.</span>
          ) : cgpa < 2.5 ? (
            <span>Needs Improvement – Consider focusing more on core subjects.</span>
          ) : cgpa < 3 ? (
            <span>Fair – You're doing okay, but there's room to grow.</span>
          ) : cgpa < 3.5 ? (
            <span>Good – Keep up the steady performance!</span>
          ) : (
            <span>🎉 Excellent – Great academic standing!</span>
          )}
        </p>
      </div>

      {/* Semester Breakdown */}
      {semesters.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Semester Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            {semesters.map((semester, index) => (
              <div
                key={`${semester.year}-${semester.semester}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div>
                  <h4 className="font-medium text-gray-800">
                    {semester.semester} {semester.year}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {semester.courses.length} courses • {semester.totalCredits} credits
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getGPAColor(semester.gpa)}`}>
                    {formatGPA(semester.gpa)}
                  </p>
                  <p className="text-xs text-gray-500">GPA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
