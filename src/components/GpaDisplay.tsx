import { Award, BookOpen, TrendingUp } from 'lucide-react';
import React from 'react';
import { SemesterData } from '../types';
import { formatGPA } from '../utils/calculations';
import { getGPAColor } from '../utils/gradeSystem';

import { ProbationInfo } from '../types';

interface GpaDisplayProps {
  cgpa: number;
  totalCredits: number;
  semesters: SemesterData[];
  probation?: ProbationInfo;
}

const getGpaCommentStyle = (cgpa: number) => {
  if (cgpa === 0) return 'from-gray-400 to-gray-500';
  if (cgpa < 2) return 'from-red-500 to-red-700';
  if (cgpa < 2.5) return 'from-yellow-400 to-yellow-600';
  if (cgpa < 3) return 'from-blue-400 to-blue-600';
  if (cgpa < 3.5) return 'from-green-400 to-green-600';
  return 'from-emerald-500 to-emerald-700';
};

export const GpaDisplay: React.FC<GpaDisplayProps> = ({ cgpa, totalCredits, semesters, probation }) => {
  const getShortStatus = () => {
  const isNoData = semesters.length === 0 && cgpa === 0;
  if (isNoData) return null;
    if (!probation || probation.stage === 0) return null;
    if (probation.dismissed) return `Probation ${probation.stage} • At risk of dismissal`;
    if (probation.stage === 1) return `Probation 1 • Automatic advising`;
    if (probation.stage === 2) return `Probation 2 • Yellow undertaking`;
    if (probation.stage === 3) return `Probation 3 • Parent meeting required`;
    return `Probation ${probation.stage}`;
  };
  const shortStatus = getShortStatus();

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
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium">
            {semesters.length === 0 && cgpa === 0 ? (
                <span>No GPA recorded yet. Start your academic journey!</span>
              ) : shortStatus ? (
                <span>⚠️ {shortStatus} — You need to improve your GPA to avoid academic penalties.</span>
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

          {/* Probation badge (hidden when there's no data) */}
          {! (semesters.length === 0 && cgpa === 0) && probation && probation.stage > 0 && (
            <div className="text-right ml-4">
              <div className="text-xs font-semibold">Probation Stage</div>
              <div className="mt-1 inline-block px-2 py-1 rounded-full bg-white/20">
                <span className="font-bold">P{probation.stage}</span>
              </div>
              {probation.dismissed && (
                <div className="text-xs mt-1 text-red-100">At risk of dismissal</div>
              )}
            </div>
          )}
        </div>

  {/* Detailed advising text for probation stages (hidden when there's no data) */}
  {! (semesters.length === 0 && cgpa === 0) && probation && probation.stage > 0 && (
          <div className="mt-3 text-xs bg-white/10 p-3 rounded">
            {probation.stage === 1 && (
              <div>
                <div className="font-semibold">Probation 1 — First Warning</div>
                <ul className="list-disc pl-5 mt-1">
                  <li>No parent meeting is required.</li>
                  <li>Automatic advising will be provided by the department.</li>
                  <li>Focus on improving this semester's GPA to reach 2.00.</li>
                </ul>
              </div>
            )}
            {probation.stage === 2 && (
              <div>
                <div className="font-semibold">Probation 2 — Second Warning</div>
                <ul className="list-disc pl-5 mt-1">
                  <li>Student signs a yellow undertaking.</li>
                  <li>Self-advising is allowed but requires Chair approval.</li>
                  <li>Follow a clear plan to raise CGPA to 2.00 within the allowed semesters.</li>
                </ul>
              </div>
            )}
            {probation.stage === 3 && (
              <div>
                <div className="font-semibold">Probation 3 — Final Warning</div>
                <ul className="list-disc pl-5 mt-1">
                  <li>Parent must attend a meeting with the department.</li>
                  <li>Student signs a light red undertaking.</li>
                  <li>Self-advising is allowed but requires Chair approval.</li>
                  <li>Failure to raise CGPA to 2.00 within three semesters may lead to dismissal.</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Semester Breakdown */}
      {semesters.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Semester Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            {semesters.map((semester) => (
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
