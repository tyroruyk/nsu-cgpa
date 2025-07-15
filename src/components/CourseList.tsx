import React from 'react';
import { Trash2 } from 'lucide-react';
import { Course } from '../types';
import { getGradeColor } from '../utils/gradeSystem';

interface CourseListProps {
  courses: Course[];
  onDeleteCourse: (id: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onDeleteCourse }) => {
  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500 text-lg">No courses added yet</p>
        <p className="text-gray-400 text-sm mt-1">Add your first course to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h4 className="font-semibold text-gray-800 text-lg">{course.name}</h4>
                <span className={`font-bold text-lg ${getGradeColor(course.grade)}`}>
                  {course.grade}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {course.creditHour} Credit{course.creditHour !== 1 ? 's' : ''}
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {course.semester} {course.year}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDeleteCourse(course.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
              title="Delete course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};