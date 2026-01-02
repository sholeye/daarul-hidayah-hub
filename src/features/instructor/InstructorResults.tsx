/**
 * =============================================================================
 * INSTRUCTOR RESULTS PAGE - Enter scores for students
 * =============================================================================
 */

import React, { useState } from 'react';
import { FiFileText, FiSave, FiEdit2 } from 'react-icons/fi';
import { mockStudents, schoolClasses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { calculateGrade, getGradeRemarks } from '@/utils/helpers';

const SUBJECTS = ['Arabic Language', 'Islamic Studies', 'Quran Memorization', 'Hadith', 'Fiqh', 'English Language', 'Mathematics', 'IT/Computer'];

export const InstructorResults: React.FC = () => {
  const assignedClasses = schoolClasses.slice(0, 2);
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0]?.name || '');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const students = mockStudents.filter(s => s.class === selectedClass);

  const handleSave = () => {
    if (!selectedStudent) return;
    toast.success('Results saved successfully!');
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
          <div className="space-y-2">
            {students.map(student => (
              <button key={student.id} onClick={() => { setSelectedStudent(student.studentId); setScores({}); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedStudent === student.studentId ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedStudent === student.studentId ? 'bg-primary-foreground/20' : 'bg-gradient-to-br from-primary to-primary/70'}`}>
                  <span className={selectedStudent === student.studentId ? 'text-primary-foreground' : 'text-primary-foreground'}>{student.fullName[0]}</span>
                </div>
                <div className="text-left"><p className="font-medium">{student.fullName}</p><p className={`text-sm ${selectedStudent === student.studentId ? 'opacity-75' : 'text-muted-foreground'}`}>{student.studentId}</p></div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          {selectedStudent ? (
            <>
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-foreground">Enter Scores</h3><Button onClick={handleSave}><FiSave className="w-4 h-4 mr-2" />Save</Button></div>
              <div className="space-y-4">
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
