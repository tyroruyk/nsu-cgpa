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

          {/* GPA Trend Visualization */}
          {semesters.length > 1 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">GPA Trend</h4>
              <div className="flex items-end gap-2 h-20">
                {semesters.map((semester, index) => (
                  <div
                    key={`${semester.year}-${semester.semester}`}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                      style={{ height: `${(semester.gpa / 4.0) * 100}%` }}
                      title={`${semester.semester} ${semester.year}: ${formatGPA(semester.gpa)}`}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {semester.semester.slice(0, 3)} {semester.year.toString().slice(-2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};