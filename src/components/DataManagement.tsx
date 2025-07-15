import { AlertCircle, CheckCircle, Download, Upload } from 'lucide-react';
import React, { useRef } from 'react';
import { AcademicData, Course } from '../types';

interface DataManagementProps {
  courses: Course[];
  cgpa: number;
  totalCredits: number;
  name: string;
  studentId: string;
  onImportData: (courses: Course[]) => void;
  setName: (name: string) => void;
  setStudentId: (id: string) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  courses,
  cgpa,
  totalCredits,
  name,
  studentId,
  onImportData,
  setName,
  setStudentId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const exportData = () => {
    const academicData: AcademicData = {
      name,
      studentId,
      courses,
      cgpa,
      totalCredits,
      semesters: [], // This will be calculated on import
    };

    const dataStr = JSON.stringify(academicData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    // Sanitize name and studentId for filename
    const safeName = name ? name.replace(/[^a-zA-Z0-9-_]/g, '_') : 'student';
    const safeId = studentId ? studentId.replace(/[^a-zA-Z0-9-_]/g, '_') : 'id';
    const fileName = `${safeName}_${safeId}_cgpa.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ type: 'success', text: 'Data exported successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        if (!jsonData.courses || !Array.isArray(jsonData.courses)) {
          throw new Error('Invalid data format: courses array not found');
        }

        for (const course of jsonData.courses) {
          if (!course.id || !course.name || !course.creditHour || !course.grade || !course.year || !course.semester) {
            throw new Error('Invalid course data format');
          }
        }

        onImportData(jsonData.courses);

        // Set name and studentId if present in imported JSON
        if (jsonData.name) {
          setName(jsonData.name);
        }
        if (jsonData.studentId) {
          setStudentId(jsonData.studentId);
        }

        setMessage({ type: 'success', text: 'Data imported successfully!' });

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: `Import failed: ${error instanceof Error ? error.message : 'Invalid file format'}`,
        });
      }

      setTimeout(() => setMessage(null), 5000);
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={exportData}
          disabled={courses.length === 0}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
        
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium">
            <Upload className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-1">• Export: Download your academic data as a JSON file</p>
        <p>• Import: Upload a previously exported JSON file to restore your data</p>
      </div>
    </div>
  );
};
