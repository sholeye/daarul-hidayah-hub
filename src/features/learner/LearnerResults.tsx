/**
 * =============================================================================
 * LEARNER RESULTS PAGE
 * =============================================================================
 * 
 * Fee-gated result viewing with PDF download capability.
 * =============================================================================
 */

import React from 'react';
import { 
  FiFileText, FiDownload, FiLock, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { mockStudents, mockResults } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { calculateGrade, getGradeRemarks } from '@/utils/helpers';
import jsPDF from 'jspdf';

// ---------------------------------------------------------------------------
// Main Results Page Component
// ---------------------------------------------------------------------------
export const LearnerResults: React.FC = () => {
  const { getStudentByUserId } = useAuth();
  const student = getStudentByUserId() || mockStudents[0];
  const result = mockResults.find(r => r.studentId === student.studentId);
  
  const feesPaid = student.feeStatus === 'paid';

  // Generate PDF Result
  const generateResultPDF = () => {
    if (!feesPaid) {
      toast.error('Cannot download result - fees not fully paid!');
      return;
    }

    if (!result) {
      toast.error('No result available to download');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Results</h1>
          <p className="text-muted-foreground mt-1">View your academic performance</p>
        </div>
        {result && feesPaid && (
          <Button onClick={generateResultPDF} className="btn-glow">
            <FiDownload className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>

      {/* Fee Gate Check */}
      {!feesPaid && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <FiLock className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold text-destructive">Result Access Locked</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your school fees have not been fully paid. Please complete your payment to access your academic results.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="unpaid">{student.feeStatus}</Badge>
                <span className="text-sm text-muted-foreground">
                  Balance: ₦{(student.totalFee - student.amountPaid).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Result Available */}
      {!result && feesPaid && (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <FiFileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground">No Results Available</h2>
          <p className="text-muted-foreground mt-2">
            Your academic results have not been uploaded yet. Please check back later.
          </p>
        </div>
      )}

      {/* Result Display (only if fees paid and result exists) */}
      {result && feesPaid && (
        <>
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{result.term} - {result.session}</h2>
                <p className="opacity-90 mt-1">{student.class}</p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold">{result.averageScore.toFixed(1)}%</p>
                  <p className="text-sm opacity-75">Average</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{result.position}</p>
                  <p className="text-sm opacity-75">Position</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{result.totalScore}</p>
                  <p className="text-sm opacity-75">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Results */}
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground">Subject Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Subject</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Score</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Grade</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{subject.subject}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-foreground">{subject.score}</span>
                        <span className="text-muted-foreground">/100</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={
                          subject.grade === 'A+' || subject.grade === 'A' ? 'paid' :
                          subject.grade === 'B' || subject.grade === 'C' ? 'present' :
                          subject.grade === 'D' || subject.grade === 'E' ? 'late' : 'absent'
                        }>
                          {subject.grade}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{subject.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Teacher&apos;s Remarks</h3>
              <p className="text-muted-foreground">
                {result.teacherRemarks || 'No remarks provided'}
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3">Principal&apos;s Remarks</h3>
              <p className="text-muted-foreground">
                {result.principalRemarks || 'No remarks provided'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
