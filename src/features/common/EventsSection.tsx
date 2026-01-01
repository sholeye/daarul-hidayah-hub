import React from 'react';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { mockEvents } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export const EventsSection: React.FC = () => {
  const ongoingEvents = mockEvents.filter(e => e.type === 'ongoing');
  const upcomingEvents = mockEvents.filter(e => e.type === 'upcoming');

  return (
    <section id="events" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            School <span className="text-gradient-primary">Events</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay updated with our ongoing programs and upcoming events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Ongoing Events */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FiClock className="w-5 h-5 text-secondary" />
              <h3 className="text-xl font-bold text-foreground">Ongoing</h3>
            </div>
            <div className="space-y-4">
              {ongoingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5 rounded-xl bg-secondary/5 border-l-4 border-secondary"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <Badge variant="warning">Ongoing</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FiMapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              ))}
              {ongoingEvents.length === 0 && (
                <p className="text-muted-foreground text-sm italic">No ongoing events at the moment.</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FiCalendar className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Upcoming</h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <Badge variant="success">Upcoming</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
