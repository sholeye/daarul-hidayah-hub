/**
 * =============================================================================
 * LEARNER PROFILE PAGE
 * =============================================================================
 * 
 * Displays student profile information (ID visible, QR hidden).
 * =============================================================================
 */

import React from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiUsers, FiBriefcase
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { mockStudents } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/helpers';

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
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Profile Page Component
// ---------------------------------------------------------------------------
export const LearnerProfile: React.FC = () => {
  const { getStudentByUserId } = useAuth();
  const student = getStudentByUserId() || mockStudents[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">View your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4">
            {student.imageUrl ? (
              <img 
                src={student.imageUrl} 
                alt={student.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary-foreground">
                {student.fullName[0]}
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-foreground">{student.fullName}</h2>
          <p className="text-muted-foreground mt-1">{student.email}</p>
          
          <div className="mt-4 p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Student ID</p>
            <p className="text-lg font-bold text-primary">{student.studentId}</p>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <Badge variant={student.feeStatus === 'paid' ? 'paid' : 'unpaid'}>
              {student.feeStatus}
            </Badge>
            <Badge variant="default">{student.class}</Badge>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-border">
              <InfoRow icon={FiUser} label="Full Name" value={student.fullName} />
              <InfoRow icon={FiMail} label="Email Address" value={student.email} />
              <InfoRow icon={FiPhone} label="Phone Number" value={student.phone} />
              <InfoRow icon={FiCalendar} label="Date of Birth" value={formatDate(student.dateOfBirth)} />
              <InfoRow icon={FiMapPin} label="Address" value={student.address} />
              <InfoRow icon={FiMapPin} label="State of Origin" value={student.origin} />
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Guardian Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-border">
              <InfoRow icon={FiUsers} label="Guardian Name" value={student.guardian.name} />
              <InfoRow icon={FiPhone} label="Guardian Phone" value={student.guardian.phone} />
              <InfoRow icon={FiBriefcase} label="Occupation" value={student.guardian.occupation} />
              <InfoRow icon={FiMapPin} label="State of Origin" value={student.guardian.stateOfOrigin} />
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-border">
              <InfoRow icon={FiCalendar} label="Class" value={student.class} />
              <InfoRow icon={FiCalendar} label="Enrollment Date" value={formatDate(student.enrollmentDate)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
