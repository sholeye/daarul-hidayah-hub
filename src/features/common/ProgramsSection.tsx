import React from 'react';
import { FiBook, FiMonitor, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const ProgramsSection: React.FC = () => {
  const programs = [
    {
      icon: FiBook,
      title: 'Tahfiz Program',
      titleArabic: 'برنامج التحفيظ',
      status: 'New',
      description: 'Dedicated Quran memorization program for students committed to preserving the Holy Quran in their hearts.',
      features: [
        'Structured memorization schedule',
        'Tajweed and recitation training',
        'Regular revision sessions',
        'Certified upon completion',
      ],
      gradient: 'from-primary to-primary/80',
    },
    {
      icon: FiMonitor,
      title: 'IT Program',
      titleArabic: 'برنامج تقنية المعلومات',
      status: 'Ongoing',
      description: 'Introduction to web development covering HTML, CSS, and fundamental web design principles.',
      features: [
        'HTML structure and semantics',
        'CSS styling and layouts',
        'Responsive web design',
        'Hands-on projects',
      ],
      gradient: 'from-secondary to-secondary/80',
    },
  ];

  return (
    <section id="programs" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Special <span className="text-gradient-primary">Programs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Beyond our core curriculum, we offer specialized programs to develop 
            additional skills and deepen Islamic knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program) => (
            <div
              key={program.title}
              className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft group"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${program.gradient} p-6 text-primary-foreground`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <program.icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-foreground/20 text-xs font-medium">
                    {program.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{program.title}</h3>
                <p className="text-primary-foreground/70 text-sm">{program.titleArabic}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground mb-4">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Learn More <FiArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
