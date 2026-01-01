import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { schoolClasses } from '@/data/mockData';

export const AcademicStructureSection: React.FC = () => {
  const preparatoryClasses = schoolClasses.filter(c => c.level === 'preparatory');
  const primaryClasses = schoolClasses.filter(c => c.level === 'primary');

  return (
    <section id="structure" className="py-20 md:py-28 bg-muted/30 islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Academic <span className="text-gradient-primary">Structure</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our structured curriculum spans preparatory and primary levels, ensuring a solid foundation in Islamic and academic knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Preparatory Level */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">P</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Preparatory Level</h3>
                <p className="text-sm text-muted-foreground">Foundation Classes</p>
              </div>
            </div>
            <div className="space-y-3">
              {preparatoryClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FiChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    <div>
                      <p className="font-medium text-foreground">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.nameArabic}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {cls.studentCount} students
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Level */}
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <span className="text-secondary font-bold">I</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Primary Level</h3>
                <p className="text-sm text-muted-foreground">Ibtida'i Classes</p>
              </div>
            </div>
            <div className="space-y-3">
              {primaryClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FiChevronRight className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform" />
                    <div>
                      <p className="font-medium text-foreground">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.nameArabic}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                    {cls.studentCount} students
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fee Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-card border border-border shadow-soft">
            <span className="text-muted-foreground">School Fees:</span>
            <span className="text-2xl font-bold text-primary">₦6,000</span>
            <span className="text-muted-foreground">per term</span>
          </div>
        </div>
      </div>
    </section>
  );
};
