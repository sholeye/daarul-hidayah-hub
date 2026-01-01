import React from 'react';
import { FiBell, FiAlertCircle, FiBookOpen, FiCalendar } from 'react-icons/fi';
import { mockAnnouncements } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/helpers';

const categoryIcons = {
  general: FiBell,
  academic: FiBookOpen,
  event: FiCalendar,
  urgent: FiAlertCircle,
};

const categoryVariants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  general: 'secondary',
  academic: 'success',
  event: 'default',
  urgent: 'warning',
};

export const AnnouncementsSection: React.FC = () => {
  const activeAnnouncements = mockAnnouncements.filter(a => a.isActive);

  return (
    <section id="announcements" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest <span className="text-gradient-primary">Announcements</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Important updates and notices from the school administration.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {activeAnnouncements.map((announcement) => {
            const Icon = categoryIcons[announcement.category];
            return (
              <div
                key={announcement.id}
                className="p-5 md:p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-soft transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                      <Badge variant={categoryVariants[announcement.category]}>
                        {announcement.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {formatDate(announcement.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {activeAnnouncements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No announcements at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
