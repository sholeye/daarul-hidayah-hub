/**
 * =============================================================================
 * LEARNER PROFILE PAGE
 * =============================================================================
 * 
 * Displays student profile information with password reset request functionality.
 * =============================================================================
 */

import React, { useState } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiUsers, FiBriefcase, FiKey, FiCheck
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockStudents } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/helpers';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Profile Info Row Component
// ---------------------------------------------------------------------------
interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Profile Page Component
// ---------------------------------------------------------------------------
export const LearnerProfile: React.FC = () => {
  const { getStudentByUserId } = useAuth();
  const { t, isRTL } = useLanguage();
  const student = getStudentByUserId() || mockStudents[0];
  const [passwordResetRequested, setPasswordResetRequested] = useState(false);

  const handlePasswordReset = () => {
    setPasswordResetRequested(true);
    toast.success(t.passwordResetRequested);
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.profile}</h1>
          <p className="text-muted-foreground mt-1">{t.personalInfo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4">
            {student.imageUrl ? (
              <img 
                src={student.imageUrl} 
                alt={student.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                {student.fullName[0]}
              </span>
            )}
          </div>
          
          <h2 className="text-lg sm:text-xl font-bold text-foreground">{student.fullName}</h2>
          <p className="text-muted-foreground mt-1 text-sm break-all">{student.email}</p>
          
          <div className="mt-4 p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">{t.studentId}</p>
            <p className="text-lg font-bold text-primary">{student.studentId}</p>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant={student.feeStatus === 'paid' ? 'paid' : 'unpaid'}>
              {student.feeStatus}
            </Badge>
            <Badge variant="default">{student.class}</Badge>
          </div>

          {/* Password Reset Button */}
          <div className="mt-6 pt-4 border-t border-border">
            {passwordResetRequested ? (
              <div className="p-3 bg-primary/10 rounded-xl">
                <FiCheck className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-primary font-medium">{t.passwordResetRequested}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.passwordResetInfo}</p>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePasswordReset}
                className="w-full"
              >
                <FiKey className="w-4 h-4 mr-2" />
                {t.requestPasswordReset}
              </Button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-4">{t.personalInfo}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-border">
              <InfoRow icon={FiUser} label={t.fullName} value={student.fullName} />
              <InfoRow icon={FiMail} label={t.email} value={student.email} />
              <InfoRow icon={FiPhone} label={t.phone} value={student.phone} />
              <InfoRow icon={FiCalendar} label={t.dateOfBirth} value={formatDate(student.dateOfBirth)} />
              <InfoRow icon={FiMapPin} label={t.address} value={student.address} />
              <InfoRow icon={FiMapPin} label={t.stateOfOrigin} value={student.origin} />
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-4">{t.guardianInfo}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-border">
              <InfoRow icon={FiUsers} label={t.guardianName} value={student.guardian.name} />
              <InfoRow icon={FiPhone} label={t.guardianPhone} value={student.guardian.phone} />
              <InfoRow icon={FiBriefcase} label={t.occupation} value={student.guardian.occupation} />
              <InfoRow icon={FiMapPin} label={t.stateOfOrigin} value={student.guardian.stateOfOrigin} />
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-4">{t.academicInfo}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-border">
              <InfoRow icon={FiCalendar} label={t.class} value={student.class} />
              <InfoRow icon={FiCalendar} label={t.enrollmentDate} value={formatDate(student.enrollmentDate)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
