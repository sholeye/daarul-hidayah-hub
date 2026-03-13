/**
 * =============================================================================
 * SETTINGS PAGE
 * =============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiSave,
  FiGlobe, FiLock, FiUsers, FiBookOpen,
} from 'react-icons/fi';
import { useAuth } from '@/features/auth/AuthContext';
import { useSharedData } from '@/contexts/SharedDataContext';
import { supabase, createIsolatedAuthClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { InlineLoader } from '@/components/ui/page-loader';
import { ProfileAvatarUploader } from '@/components/ProfileAvatarUploader';
import { toast } from 'sonner';

interface RoleProfile {
  id: string;
  full_name: string;
  email: string;
}

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { students, schoolClasses, refreshAll, isLoading } = useSharedData();

  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Daarul Hidayah',
    motto: 'Learn for servitude to Allah and Sincerity of Religion',
    email: 'daarulhidayahabk@gmail.com',
    phone: '08085944916',
    address: 'Ita Ika, Abeokuta, Ogun State',
    termFee: '6000',
  });

  const [userSettings, setUserSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const [parents, setParents] = useState<RoleProfile[]>([]);
  const [instructors, setInstructors] = useState<RoleProfile[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [linkedStudentIds, setLinkedStudentIds] = useState<string[]>([]);
  const [classAssignments, setClassAssignments] = useState<Record<string, string>>({});

  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isSavingParentLinks, setIsSavingParentLinks] = useState(false);
  const [isSavingClassAssignments, setIsSavingClassAssignments] = useState(false);
  const [isLoadingRoleData, setIsLoadingRoleData] = useState(true);

  const studentOptions = useMemo(() => students.map((student) => ({
    id: student.studentId,
    label: `${student.fullName} (${student.studentId})`,
    className: student.class,
  })), [students]);

  useEffect(() => {
    setUserSettings((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
    }));
  }, [user?.name, user?.email]);

  useEffect(() => {
    const initialAssignments = schoolClasses.reduce((acc: Record<string, string>, schoolClass) => {
      acc[schoolClass.id] = schoolClass.instructorId || '';
      return acc;
    }, {});
    setClassAssignments(initialAssignments);
  }, [schoolClasses]);

  useEffect(() => {
    const loadRoleUsers = async () => {
      setIsLoadingRoleData(true);

      const { data: roleRows, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['parent', 'instructor']);

      if (roleError) {
        toast.error('Failed to load role users.');
        setIsLoadingRoleData(false);
        return;
      }

      const parentIds = (roleRows || []).filter((row) => row.role === 'parent').map((row) => row.user_id);
      const instructorIds = (roleRows || []).filter((row) => row.role === 'instructor').map((row) => row.user_id);
      const uniqueIds = [...new Set([...parentIds, ...instructorIds])];

      if (uniqueIds.length === 0) {
        setParents([]);
        setInstructors([]);
        setIsLoadingRoleData(false);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', uniqueIds);

      if (profileError) {
        toast.error('Failed to load profile details.');
        setIsLoadingRoleData(false);
        return;
      }

      const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));

      setParents(parentIds
        .map((id) => profileMap.get(id))
        .filter((profile): profile is RoleProfile => Boolean(profile))
        .sort((a, b) => a.full_name.localeCompare(b.full_name)));

      setInstructors(instructorIds
        .map((id) => profileMap.get(id))
        .filter((profile): profile is RoleProfile => Boolean(profile))
        .sort((a, b) => a.full_name.localeCompare(b.full_name)));

      setIsLoadingRoleData(false);
    };

    loadRoleUsers();
  }, []);

  useEffect(() => {
    const loadParentLinks = async () => {
      if (!selectedParentId) {
        setLinkedStudentIds([]);
        return;
      }

      const { data, error } = await supabase
        .from('parent_students')
        .select('student_id')
        .eq('parent_id', selectedParentId);

      if (error) {
        toast.error('Failed to load linked children.');
        return;
      }

      setLinkedStudentIds((data || []).map((row) => row.student_id));
    };

    loadParentLinks();
  }, [selectedParentId]);

  const handleSaveSchool = () => {
    toast.success('School settings saved!');
  };

  const handleToggleLinkedStudent = (studentId: string, checked: boolean) => {
    setLinkedStudentIds((prev) => {
      if (checked) return [...new Set([...prev, studentId])];
      return prev.filter((id) => id !== studentId);
    });
  };

  const handleSaveParentLinks = async () => {
    if (!selectedParentId) {
      toast.error('Select a parent first.');
      return;
    }

    setIsSavingParentLinks(true);
    try {
      const { error: deleteError } = await supabase
        .from('parent_students')
        .delete()
        .eq('parent_id', selectedParentId);

      if (deleteError) throw deleteError;

      if (linkedStudentIds.length > 0) {
        const { error: insertError } = await supabase
          .from('parent_students')
          .insert(linkedStudentIds.map((studentId) => ({
            parent_id: selectedParentId,
            student_id: studentId,
          })));

        if (insertError) throw insertError;
      }

      toast.success('Parent-child assignments updated.');
      await refreshAll();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save parent links.');
    } finally {
      setIsSavingParentLinks(false);
    }
  };

  const handleSaveClassAssignments = async () => {
    setIsSavingClassAssignments(true);
    try {
      await Promise.all(
        schoolClasses.map((schoolClass) => {
          const instructorId = classAssignments[schoolClass.id] || null;
          return supabase
            .from('school_classes')
            .update({ instructor_id: instructorId })
            .eq('id', schoolClass.id);
        }),
      );

      toast.success('Instructor-class assignments updated.');
      await refreshAll();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save class assignments.');
    } finally {
      setIsSavingClassAssignments(false);
    }
  };

  const handleSaveUser = async () => {
    if (!user) {
      toast.error('You must be logged in to update your profile.');
      return;
    }

    const desiredName = userSettings.name.trim();
    const desiredEmail = userSettings.email.trim().toLowerCase();

    const wantsPasswordChange = !!userSettings.newPassword.trim();
    const wantsEmailChange = desiredEmail !== (user.email || '').trim().toLowerCase();
    const wantsNameChange = desiredName !== (user.name || '').trim();

    if (!wantsNameChange && !wantsEmailChange && !wantsPasswordChange) {
      toast.message('No changes to save.');
      return;
    }

    if (wantsPasswordChange && !userSettings.currentPassword) {
      toast.error('Enter your current password to set a new one.');
      return;
    }

    setIsSavingUser(true);
    try {
      if (wantsNameChange) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: desiredName },
        });
        if (error) throw error;
      }

      if (wantsEmailChange) {
        const { error } = await supabase.auth.updateUser({
          email: desiredEmail,
        });
        if (error) throw error;
      }

      if (wantsPasswordChange) {
        const isolated = createIsolatedAuthClient();
        const { error: signInError } = await isolated.auth.signInWithPassword({
          email: user.email,
          password: userSettings.currentPassword,
        });
        await isolated.auth.signOut();

        if (signInError) throw new Error('Current password is incorrect.');

        const { error } = await supabase.auth.updateUser({
          password: userSettings.newPassword,
        });
        if (error) throw error;
      }

      await refreshUser();
      toast.success(wantsEmailChange ? 'Update saved — check your inbox to confirm email changes.' : 'Profile updated.');
      setUserSettings((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile.');
    } finally {
      setIsSavingUser(false);
    }
  };

  if (isLoading || isLoadingRoleData) return <InlineLoader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage school, account, and assignment settings</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiGlobe className="w-5 h-5 text-primary" />
          School Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
            <Input value={schoolSettings.name} onChange={(event) => setSchoolSettings({ ...schoolSettings, name: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Term Fee (₦)</label>
            <Input value={schoolSettings.termFee} onChange={(event) => setSchoolSettings({ ...schoolSettings, termFee: event.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Motto</label>
            <Input value={schoolSettings.motto} onChange={(event) => setSchoolSettings({ ...schoolSettings, motto: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiMail className="w-4 h-4 inline mr-1" /> Email
            </label>
            <Input type="email" value={schoolSettings.email} onChange={(event) => setSchoolSettings({ ...schoolSettings, email: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiPhone className="w-4 h-4 inline mr-1" /> Phone
            </label>
            <Input value={schoolSettings.phone} onChange={(event) => setSchoolSettings({ ...schoolSettings, phone: event.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiMapPin className="w-4 h-4 inline mr-1" /> Address
            </label>
            <Input value={schoolSettings.address} onChange={(event) => setSchoolSettings({ ...schoolSettings, address: event.target.value })} />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button onClick={handleSaveSchool}>
            <FiSave className="w-4 h-4 mr-2" /> Save School Settings
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-primary" />
          Parent ↔ Student Assignment
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Parent</label>
            <select
              value={selectedParentId}
              onChange={(event) => setSelectedParentId(event.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
            >
              <option value="">Choose parent account</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>{parent.full_name} ({parent.email})</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-border p-4 max-h-80 overflow-y-auto space-y-3">
            {studentOptions.length === 0 && <p className="text-sm text-muted-foreground">No students found.</p>}
            {studentOptions.map((student) => {
              const checked = linkedStudentIds.includes(student.id);
              return (
                <label key={student.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => handleToggleLinkedStudent(student.id, Boolean(value))}
                  />
                  <span className="text-sm text-foreground">{student.label} <span className="text-muted-foreground">• {student.className}</span></span>
                </label>
              );
            })}
          </div>

          <Button onClick={handleSaveParentLinks} disabled={!selectedParentId || isSavingParentLinks}>
            <FiSave className="w-4 h-4 mr-2" />
            {isSavingParentLinks ? 'Saving links...' : 'Save Parent Links'}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiBookOpen className="w-5 h-5 text-primary" />
          Instructor ↔ Class Assignment
        </h2>

        <div className="space-y-3">
          {schoolClasses.map((schoolClass) => (
            <div key={schoolClass.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <div>
                <p className="font-medium text-foreground">{schoolClass.name}</p>
                <p className="text-xs text-muted-foreground">{schoolClass.nameArabic}</p>
              </div>
              <select
                value={classAssignments[schoolClass.id] || ''}
                onChange={(event) => setClassAssignments((prev) => ({ ...prev, [schoolClass.id]: event.target.value }))}
                className="h-10 px-3 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="">Unassigned</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>{instructor.full_name} ({instructor.email})</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button onClick={handleSaveClassAssignments} disabled={isSavingClassAssignments}>
            <FiSave className="w-4 h-4 mr-2" />
            {isSavingClassAssignments ? 'Saving assignments...' : 'Save Class Assignments'}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <FiUser className="w-5 h-5 text-primary" />
          Profile Settings
        </h2>

        <div className="mb-6">
          <ProfileAvatarUploader sizeClass="w-16 h-16" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input value={userSettings.name} onChange={(event) => setUserSettings({ ...userSettings, name: event.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input type="email" value={userSettings.email} onChange={(event) => setUserSettings({ ...userSettings, email: event.target.value })} />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiLock className="w-4 h-4" />
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
              <Input
                type="password"
                value={userSettings.currentPassword}
                onChange={(event) => setUserSettings({ ...userSettings, currentPassword: event.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <Input
                type="password"
                value={userSettings.newPassword}
                onChange={(event) => setUserSettings({ ...userSettings, newPassword: event.target.value })}
                placeholder="Enter new password"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button onClick={handleSaveUser} disabled={isSavingUser}>
            <FiSave className="w-4 h-4 mr-2" />
            {isSavingUser ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};
