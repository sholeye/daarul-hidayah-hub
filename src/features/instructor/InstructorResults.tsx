/**
 * Instructor Results Page - Enter/Edit scores with shared state
 */

import React, { useState } from 'react';
import { FiFileText, FiSave, FiCheck } from 'react-icons/fi';
import { schoolClasses } from '@/data/mockData';
import { Student, StudentResult } from '@/types';
import { useSharedData } from '@/contexts/SharedDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { calculateGrade, getGradeRemarks } from '@/utils/helpers';

const SUBJECTS = ['Arabic Language', 'Islamic Studies', 'Quran Memorization', 'Hadith', 'Fiqh', 'English Language', 'Mathematics', 'IT/Computer'];

export const InstructorResults: React.FC = () => {
  const { students, results, addOrUpdateResult } = useSharedData();
  const assignedClasses = schoolClasses.slice(0, 2);
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0]?.name || '');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [position, setPosition] = useState('1');

  const classStudents = students.filter(s => s.class === selectedClass);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    const existingResult = results.find(r => r.studentId === student.studentId);
    if (existingResult) {
      const scoreMap: Record<string, number> = {};
      existingResult.subjects.forEach(s => { scoreMap[s.subject] = s.score; });
      setScores(scoreMap);
      setTeacherRemarks(existingResult.teacherRemarks || '');
      setPosition(existingResult.position?.toString() || '1');
    } else {
      setScores({});
      setTeacherRemarks('');
      setPosition('1');
    }
  };

  const handleSave = () => {
    if (!selectedStudent) return;
    const subjects = SUBJECTS.map(subject => {
      const score = scores[subject] || 0;
      const grade = calculateGrade(score);
      return { subject, score, grade, remarks: getGradeRemarks(grade) };
    });
    const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
    const averageScore = totalScore / subjects.length;

    addOrUpdateResult({
      id: Date.now().toString(),
      studentId: selectedStudent.studentId,
      term: 'First Term', session: '2024/2025',
      subjects, totalScore, averageScore,
      position: parseInt(position), teacherRemarks, principalRemarks: '',
      createdAt: new Date().toISOString().split('T')[0],
    });
    toast.success('Result saved successfully!');
    setSelectedStudent(null);
    setScores({});
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl sm:text-3xl font-bold text-foreground">Enter Results</h1><p className="text-muted-foreground mt-1">Enter scores for students in your classes</p></div>

      <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(null); }} className="h-10 px-4 rounded-lg border border-input bg-background text-foreground">
        {assignedClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
      </select>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Students</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {classStudents.map(student => {
              const hasResult = results.some(r => r.studentId === student.studentId);
              return (
                <button key={student.id} onClick={() => handleSelectStudent(student)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedStudent?.id === student.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedStudent?.id === student.id ? 'bg-primary-foreground/20' : 'bg-gradient-to-br from-primary to-primary/70'}`}>
                    <span className="text-primary-foreground font-bold">{student.fullName[0]}</span>
                  </div>
                  <div className="text-left flex-1"><p className="font-medium">{student.fullName}</p><p className={`text-sm ${selectedStudent?.id === student.id ? 'opacity-75' : 'text-muted-foreground'}`}>{student.studentId}</p></div>
                  {hasResult && <Badge variant="paid" className="text-xs">Done</Badge>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          {selectedStudent ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Enter Scores for {selectedStudent.fullName}</h3>
                <Button onClick={handleSave}><FiSave className="w-4 h-4 mr-2" />Save</Button>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {SUBJECTS.map(subject => {
                  const score = scores[subject] || 0;
                  const grade = calculateGrade(score);
                  return (
                    <div key={subject} className="flex items-center gap-4">
                      <div className="flex-1"><label className="text-sm text-muted-foreground">{subject}</label><Input type="number" min="0" max="100" value={scores[subject] || ''} onChange={(e) => setScores({ ...scores, [subject]: parseInt(e.target.value) || 0 })} placeholder="0" /></div>
                      <Badge variant={grade === 'A+' || grade === 'A' ? 'paid' : grade === 'F' ? 'absent' : 'present'}>{grade}</Badge>
                    </div>
                  );
                })}
                <div><label className="text-sm text-muted-foreground">Position in Class</label><Input type="number" min="1" value={position} onChange={(e) => setPosition(e.target.value)} /></div>
                <div><label className="text-sm text-muted-foreground">Teacher's Remarks</label><textarea value={teacherRemarks} onChange={(e) => setTeacherRemarks(e.target.value)} className="w-full h-20 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none" placeholder="Enter remarks..." /></div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-12"><div><FiFileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">Select a student to enter results</p></div></div>
          )}
        </div>
      </div>
    </div>
  );
};
