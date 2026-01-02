/**
 * =============================================================================
 * RESULTS MANAGEMENT PAGE
 * =============================================================================
 * 
 * Upload, manage, and generate PDF results with fee-gating logic.
 * =============================================================================
 */

import React, { useState } from 'react';
import { 
  FiFileText, FiPlus, FiSearch, FiDownload, FiX,
  FiEdit2, FiEye, FiLock, FiUnlock, FiTrash2
} from 'react-icons/fi';
import { mockStudents, mockResults } from '@/data/mockData';
import { Student, StudentResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDate, calculateGrade, getGradeRemarks } from '@/utils/helpers';
import jsPDF from 'jspdf';

// Subject list
const SUBJECTS = [
  'Arabic Language',
  'Islamic Studies',
  'Quran Memorization',
  'Hadith',
  'Fiqh',
  'English Language',
  'Mathematics',
  'IT/Computer'
];

// ---------------------------------------------------------------------------
// Result Entry Modal
// ---------------------------------------------------------------------------
interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  existingResult?: StudentResult;
  onSubmit: (result: Partial<StudentResult>) => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, student, existingResult, onSubmit }) => {
  const [scores, setScores] = useState<Record<string, number>>(
    existingResult?.subjects.reduce((acc, s) => ({ ...acc, [s.subject]: s.score }), {}) || {}
  );
  const [teacherRemarks, setTeacherRemarks] = useState(existingResult?.teacherRemarks || '');
  const [principalRemarks, setPrincipalRemarks] = useState(existingResult?.principalRemarks || '');
  const [position, setPosition] = useState(existingResult?.position?.toString() || '1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const subjects = SUBJECTS.map(subject => {
      const score = scores[subject] || 0;
      const grade = calculateGrade(score);
      return {
        subject,
        score,
        grade,
        remarks: getGradeRemarks(grade),
      };
    });

    const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
    const averageScore = totalScore / subjects.length;

    onSubmit({
      studentId: student.studentId,
      term: 'First Term',
      session: '2024/2025',
      subjects,
      totalScore,
      averageScore,
      position: parseInt(position),
      teacherRemarks,
      principalRemarks,
      createdAt: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {existingResult ? 'Edit Result' : 'Enter Result'}
            </h2>
            <p className="text-sm text-muted-foreground">{student.fullName} - {student.studentId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject Scores */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Subject Scores (0-100)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUBJECTS.map(subject => (
                <div key={subject}>
                  <label className="block text-sm text-muted-foreground mb-1">{subject}</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={scores[subject] || ''}
                    onChange={(e) => setScores({ ...scores, [subject]: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Position in Class</label>
            <Input
              type="number"
              min="1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          {/* Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teacher's Remarks</label>
              <textarea
                value={teacherRemarks}
                onChange={(e) => setTeacherRemarks(e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                placeholder="Enter teacher's remarks..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Principal's Remarks</label>
              <textarea
                value={principalRemarks}
                onChange={(e) => setPrincipalRemarks(e.target.value)}
                className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                placeholder="Enter principal's remarks..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <FiFileText className="w-4 h-4 mr-2" />
              {existingResult ? 'Update Result' : 'Save Result'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Results Page
// ---------------------------------------------------------------------------
export const ResultsPage: React.FC = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [results, setResults] = useState<StudentResult[]>(mockResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Filter students
  const studentsWithResults = students
    .filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 s.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(student => ({
      ...student,
      result: results.find(r => r.studentId === student.studentId),
    }));

  // Handle result submission
  const handleResultSubmit = (resultData: Partial<StudentResult>) => {
    const existingIndex = results.findIndex(r => r.studentId === resultData.studentId);
    
    if (existingIndex >= 0) {
      setResults(results.map((r, i) => 
        i === existingIndex ? { ...r, ...resultData } as StudentResult : r
      ));
      toast.success('Result updated successfully!');
    } else {
      const newResult = { ...resultData, id: Date.now().toString() } as StudentResult;
      setResults([newResult, ...results]);
      toast.success('Result saved successfully!');
    }
  };

  // Generate Result PDF
  const generateResultPDF = (student: Student, result: StudentResult) => {
    // Check fee status
    if (student.feeStatus !== 'paid') {
      toast.error('Cannot generate result - fees not fully paid!');
      return;
    }

    const doc = new jsPDF();
    
    // Header with school branding
    doc.setFillColor(22, 101, 52);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Daarul Hidayah', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Islamic & Arabic School', 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Ita Ika, Abeokuta, Ogun State | daarulhidayahabk@gmail.com', 105, 38, { align: 'center' });

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('STUDENT RESULT SHEET', 105, 55, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`${result.term} - ${result.session}`, 105, 62, { align: 'center' });

    // Student Info
    doc.setFontSize(10);
    doc.text(`Name: ${student.fullName}`, 20, 75);
    doc.text(`Student ID: ${student.studentId}`, 120, 75);
    doc.text(`Class: ${student.class}`, 20, 82);
    doc.text(`Position: ${result.position}`, 120, 82);

    // Results Table
    let y = 95;
    doc.setFillColor(22, 101, 52);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, y, 170, 8, 'F');
    doc.text('Subject', 25, y + 6);
    doc.text('Score', 110, y + 6);
    doc.text('Grade', 135, y + 6);
    doc.text('Remarks', 155, y + 6);

    doc.setTextColor(0, 0, 0);
    y += 10;
    result.subjects.forEach((subject, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, y - 2, 170, 8, 'F');
      }
      doc.text(subject.subject, 25, y + 4);
      doc.text(subject.score.toString(), 115, y + 4);
      doc.text(subject.grade, 140, y + 4);
      doc.text(subject.remarks, 155, y + 4);
      y += 8;
    });

    // Summary
    y += 5;
    doc.line(20, y, 190, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Total Score: ${result.totalScore}`, 20, y);
    doc.text(`Average: ${result.averageScore.toFixed(1)}%`, 80, y);
    doc.text(`Position: ${result.position}`, 140, y);

    // Remarks
    y += 15;
    doc.setFontSize(10);
    doc.text("Teacher's Remarks:", 20, y);
    doc.setFontSize(9);
    doc.text(result.teacherRemarks || 'N/A', 20, y + 6);

    y += 18;
    doc.setFontSize(10);
    doc.text("Principal's Remarks:", 20, y);
    doc.setFontSize(9);
    doc.text(result.principalRemarks || 'N/A', 20, y + 6);

    // Footer
    doc.setFontSize(8);
    doc.text('This is an official result sheet from Daarul Hidayah Islamic & Arabic School', 105, 280, { align: 'center' });

    doc.save(`Result-${student.studentId}-${result.term.replace(' ', '-')}.pdf`);
    toast.success('Result PDF downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Results</h1>
        <p className="text-muted-foreground mt-1">Manage student academic results</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students..."
          className="pl-12"
        />
      </div>

      {/* Results Table */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Class</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Result Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Fee Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Average</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentsWithResults.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold">{student.fullName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{student.class}</td>
                  <td className="px-6 py-4">
                    {student.result ? (
                      <Badge variant="paid">Uploaded</Badge>
                    ) : (
                      <Badge variant="unpaid">Pending</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {student.feeStatus === 'paid' ? (
                        <FiUnlock className="w-4 h-4 text-primary" />
                      ) : (
                        <FiLock className="w-4 h-4 text-destructive" />
                      )}
                      <Badge variant={student.feeStatus === 'paid' ? 'paid' : 'unpaid'}>
                        {student.feeStatus}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {student.result ? `${student.result.averageScore.toFixed(1)}%` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => { setSelectedStudent(student); setShowResultModal(true); }}
                      >
                        {student.result ? <FiEdit2 className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                        <span className="ml-1 hidden sm:inline">
                          {student.result ? 'Edit' : 'Add'}
                        </span>
                      </Button>
                      {student.result && (
                        <button 
                          onClick={() => generateResultPDF(student, student.result!)}
                          className={`p-2 rounded-lg transition-colors ${
                            student.feeStatus === 'paid' 
                              ? 'hover:bg-muted text-muted-foreground hover:text-foreground' 
                              : 'opacity-50 cursor-not-allowed text-muted-foreground'
                          }`}
                          title={student.feeStatus === 'paid' ? 'Download PDF' : 'Fee not paid'}
                          disabled={student.feeStatus !== 'paid'}
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => { setShowResultModal(false); setSelectedStudent(null); }}
        student={selectedStudent}
        existingResult={selectedStudent ? results.find(r => r.studentId === selectedStudent.studentId) : undefined}
        onSubmit={handleResultSubmit}
      />
    </div>
  );
};
