/**
 * Parent Fees - View children's fee status and payment history
 */

import React, { useState } from 'react';
import { FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { mockStudents, mockPayments } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/helpers';

export const ParentFees: React.FC = () => {
  const myChildren = mockStudents.slice(0, 2);
  const [selectedChild, setSelectedChild] = useState(myChildren[0]?.studentId || '');
  const child = myChildren.find(c => c.studentId === selectedChild);
  const payments = mockPayments.filter(p => p.studentId === selectedChild);
  const balance = child ? child.totalFee - child.amountPaid : 0;
  const percentage = child ? Math.round((child.amountPaid / child.totalFee) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Fee Status</h1>
        <p className="text-muted-foreground mt-1">View your children's fee payment details</p>
      </div>

      <div className="flex gap-3">
        {myChildren.map(c => (
          <button key={c.studentId} onClick={() => setSelectedChild(c.studentId)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedChild === c.studentId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {c.fullName.split(' ')[0]}
          </button>
        ))}
      </div>

      {child && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><FiDollarSign className="w-6 h-6 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Total Fee</p><p className="text-2xl font-bold text-foreground">{formatCurrency(child.totalFee)}</p></div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><FiCheckCircle className="w-6 h-6 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Amount Paid</p><p className="text-2xl font-bold text-primary">{formatCurrency(child.amountPaid)}</p></div>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${balance > 0 ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  {balance > 0 ? <FiAlertCircle className="w-6 h-6 text-destructive" /> : <FiCheckCircle className="w-6 h-6 text-primary" />}
                </div>
                <div><p className="text-sm text-muted-foreground">Balance</p><p className={`text-2xl font-bold ${balance > 0 ? 'text-destructive' : 'text-primary'}`}>{formatCurrency(balance)}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Payment Progress</h3>
              <Badge variant={child.feeStatus === 'paid' ? 'paid' : child.feeStatus === 'partial' ? 'late' : 'unpaid'}>{child.feeStatus}</Badge>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">{percentage}% paid</p>
          </div>

          {payments.length > 0 && (
            <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
              <div className="p-6 border-b border-border"><h3 className="font-semibold text-foreground">Payment History</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Receipt</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Amount</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium text-foreground">{formatDate(p.date)}</td>
                        <td className="px-6 py-4 text-sm text-foreground font-mono">{p.receiptNumber}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{formatCurrency(p.amount)}</td>
                        <td className="px-6 py-4"><Badge variant={p.status === 'completed' ? 'paid' : 'unpaid'}>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
