import React, { useState } from 'react';

const GradeTracker = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [grade, setGrade] = useState('A');
  const [gpa, setGpa] = useState(null);

  const gradeOptions = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'];
  
  const gradeToPoints = {
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F': 0.0,
    'W': 0.0
  };

  const addSubject = () => {
    if (subjectName.trim() === '') return;
    
    const newSubject = {
      id: Date.now(),
      name: subjectName.trim(),
      grade: grade
    };
    
    setSubjects([...subjects, newSubject]);
    setSubjectName('');
    setGpa(null);
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    setGpa(null);
  };

  const calculateGPA = () => {
    if (subjects.length === 0) return;

    const validSubjects = subjects.filter(subject => subject.grade !== 'W');
    
    if (validSubjects.length === 0) {
      setGpa(0);
      return;
    }

    const totalPoints = validSubjects.reduce((sum, subject) => {
      return sum + gradeToPoints[subject.grade];
    }, 0);
    
    const calculatedGPA = (totalPoints / validSubjects.length).toFixed(2);
    setGpa(calculatedGPA);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ระบบเก็บรายชื่อวิชาและเกรด</h1>
      
      {/* Input Form */}
      <div className="mb-6 p-4 border rounded">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="ชื่อวิชา"
            className="flex-1 px-3 py-2 border rounded"
          />
          
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            {gradeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          <button
            onClick={addSubject}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            เพิ่มรายวิชา
          </button>
        </div>
      </div>

      {/* Subjects List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">รายวิชาทั้งหมด</h2>
        
        {subjects.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีรายวิชา</p>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex justify-between items-center p-3 border rounded">
                <span className={subject.grade === 'F' ? 'text-red-600' : ''}>
                  {subject.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{subject.grade}</span>
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GPA Section */}
      <div className="p-4 border rounded">
        <div className="flex justify-between items-center">
          <button
            onClick={calculateGPA}
            disabled={subjects.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            คำนวณ GPA
          </button>
          
          {gpa !== null && (
            <div>
              <span className="text-lg">GPA: </span>
              <span className="text-xl font-bold">{gpa}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeTracker;