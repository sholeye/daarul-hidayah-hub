/**
 * =============================================================================
 * LEARNER FEES PAGE
 * =============================================================================
 * 
 * Displays student fee status and payment history.
 * =============================================================================
 */

import React from 'react';
import { 
  FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle, FiFileText
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { mockStudents, mockPayments } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/helpers';

// ---------------------------------------------------------------------------
// Main Fees Page Component
// ---------------------------------------------------------------------------
export const LearnerFees: React.FC = () => {
  const { getStudentByUserId } = useAuth();
  const student = getStudentByUserId() || mockStudents[0];
  
  // Get student's payment history
  const payments = mockPayments.filter(p => p.studentId === student.studentId);
  
  const feeBalance = student.totalFee - student.amountPaid;
  const paymentPercentage = Math.round((student.amountPaid / student.totalFee) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Fee Status</h1>
        <p className="text-muted-foreground mt-1">View your fee payment details</p>
      </div>

      {/* Fee Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fee</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(student.totalFee)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(student.amountPaid)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              feeBalance > 0 ? 'bg-destructive/10' : 'bg-primary/10'
            }`}>
              {feeBalance > 0 ? (
                <FiAlertCircle className="w-6 h-6 text-destructive" />
              ) : (
                <FiCheckCircle className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className={`text-2xl font-bold ${feeBalance > 0 ? 'text-destructive' : 'text-primary'}`}>
                {formatCurrency(feeBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Payment Progress</h3>
          <Badge variant={student.feeStatus === 'paid' ? 'paid' : student.feeStatus === 'partial' ? 'late' : 'unpaid'}>
            {student.feeStatus}
          </Badge>
        </div>
        
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${paymentPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-muted-foreground">0%</span>
          <span className="font-medium text-foreground">{paymentPercentage}% paid</span>
          <span className="text-muted-foreground">100%</span>
        </div>

        {feeBalance > 0 && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Outstanding Balance</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have an outstanding balance of {formatCurrency(feeBalance)}. 
                  Please complete your payment to access all features including result viewing.
                </p>
              </div>
            </div>
          </div>
        )}

        {feeBalance === 0 && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-primary">Fully Paid</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your school fees have been fully paid. You have access to all features.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Payment History</h3>
        </div>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Receipt No.</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Term</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FiFileText className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{formatDate(payment.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-mono">
                      {payment.receiptNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {payment.term} - {payment.session}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={payment.status === 'completed' ? 'paid' : 'unpaid'}>
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiDollarSign className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No payment records found</p>
          </div>
        )}
      </div>
    </div>
  );
};
