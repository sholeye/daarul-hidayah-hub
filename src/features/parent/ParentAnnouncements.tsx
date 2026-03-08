/**
 * Parent Announcements - View school announcements
 */

import React from 'react';
import { FiBell, FiCalendar, FiAlertCircle, FiInfo, FiBookOpen } from 'react-icons/fi';
import { mockAnnouncements } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/helpers';

const categoryIcons: Record<string, React.ElementType> = {
  academic: FiBookOpen, event: FiCalendar, urgent: FiAlertCircle, general: FiInfo,
};

export const ParentAnnouncements: React.FC = () => {
  const announcements = mockAnnouncements.filter(a => a.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-1">Stay updated with school news and events</p>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => {
          const Icon = categoryIcons[ann.category] || FiInfo;
          return (
            <div key={ann.id} className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  ann.category === 'urgent' ? 'bg-destructive/10' : ann.category === 'event' ? 'bg-secondary/10' : ann.category === 'academic' ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon className={`w-6 h-6 ${ann.category === 'urgent' ? 'text-destructive' : ann.category === 'event' ? 'text-secondary' : ann.category === 'academic' ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold text-foreground">{ann.title}</h3>
                    <Badge variant={ann.category === 'urgent' ? 'unpaid' : 'outline'}>{ann.category}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><FiCalendar className="w-3 h-3" />{formatDate(ann.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
        {announcements.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <FiBell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements at this time</p>
          </div>
        )}
      </div>
    </div>
  );
};
