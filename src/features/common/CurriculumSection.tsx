import React from 'react';
import { FiBookOpen, FiGlobe, FiCode, FiAward, FiUsers, FiClock } from 'react-icons/fi';

export const CurriculumSection: React.FC = () => {
  const subjects = [
    { icon: FiBookOpen, name: 'Quran & Tajweed', arabic: 'القرآن والتجويد' },
    { icon: FiBookOpen, name: 'Hadith Studies', arabic: 'دراسات الحديث' },
    { icon: FiBookOpen, name: 'Fiqh (Jurisprudence)', arabic: 'الفقه' },
    { icon: FiBookOpen, name: 'Islamic Studies', arabic: 'الدراسات الإسلامية' },
    { icon: FiGlobe, name: 'Arabic Language', arabic: 'اللغة العربية' },
    { icon: FiGlobe, name: 'English Language', arabic: 'اللغة الإنجليزية' },
    { icon: FiCode, name: 'Mathematics', arabic: 'الرياضيات' },
    { icon: FiCode, name: 'Computer/IT', arabic: 'الحاسوب' },
  ];

  return (
    <section id="curriculum" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive <span className="text-gradient-primary">Curriculum</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A balanced blend of Islamic sciences and modern academics, 
            preparing students for success in both worlds.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group"
            >
              <subject.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">{subject.name}</h4>
              <p className="text-xs text-muted-foreground">{subject.arabic}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiAward className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Qualified Teachers</h4>
              <p className="text-sm text-muted-foreground">Experienced instructors with Islamic knowledge</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Small Class Sizes</h4>
              <p className="text-sm text-muted-foreground">Personalized attention for every student</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Structured Schedule</h4>
              <p className="text-sm text-muted-foreground">Balanced timetable for effective learning</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
