import React, { useState, useEffect } from 'react';
import { FiBell, FiAlertCircle, FiBookOpen, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { mockAnnouncements } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

// Demo announcements + mock data
const DEMO_ANNOUNCEMENTS = [
  { id: 'demo-1', title: 'New Term Registration Open', content: 'Registration for the new academic term is now open. Parents are encouraged to complete the process early.', category: 'academic' as const, isActive: true, createdAt: new Date().toISOString() },
  { id: 'demo-2', title: 'Quran Competition Next Week', content: 'Annual Quran memorization competition will be held next Sunday. All students should prepare.', category: 'event' as const, isActive: true, createdAt: new Date().toISOString() },
  { id: 'demo-3', title: 'Fee Payment Reminder', content: 'Parents are reminded to complete fee payments before the end of the month to avoid late charges.', category: 'urgent' as const, isActive: true, createdAt: new Date().toISOString() },
];

const categoryIcons = { general: FiBell, academic: FiBookOpen, event: FiCalendar, urgent: FiAlertCircle };
const categoryColors = { general: 'bg-muted', academic: 'bg-primary/10 text-primary', event: 'bg-secondary/10 text-secondary', urgent: 'bg-destructive/10 text-destructive' };

export const AnnouncementsSection: React.FC = () => {
  const allAnnouncements = [...DEMO_ANNOUNCEMENTS, ...mockAnnouncements.filter(a => a.isActive)];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || allAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % allAnnouncements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, allAnnouncements.length]);

  const next = () => setCurrentIndex(prev => (prev + 1) % allAnnouncements.length);
  const prev = () => setCurrentIndex(prev => (prev - 1 + allAnnouncements.length) % allAnnouncements.length);

  if (allAnnouncements.length === 0) return null;

  return (
    <section id="announcements" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest <span className="text-gradient-primary">Announcements</span>
          </h2>
          <p className="text-muted-foreground text-lg">Important updates from the school administration</p>
        </div>

        {/* Infinite Scroll Ticker */}
        <div 
          className="relative max-w-4xl mx-auto overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-4">
            <button onClick={prev} className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors flex-shrink-0">
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {allAnnouncements.map((announcement) => {
                  const Icon = categoryIcons[announcement.category];
                  return (
                    <div key={announcement.id} className="w-full flex-shrink-0 px-2">
                      <div className="p-5 rounded-xl bg-card border border-border shadow-soft">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[announcement.category]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                              <Badge variant={announcement.category === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                                {announcement.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={next} className="p-2 rounded-full bg-card border border-border hover:bg-muted transition-colors flex-shrink-0">
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {allAnnouncements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
