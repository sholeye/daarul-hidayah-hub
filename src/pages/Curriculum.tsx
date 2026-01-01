import React from 'react';
import { Navbar } from '@/features/common/Navbar';
import { Footer } from '@/features/common/Footer';
import { CurriculumSection } from '@/features/common/CurriculumSection';
import { AcademicStructureSection } from '@/features/common/AcademicStructureSection';
import { ProgramsSection } from '@/features/common/ProgramsSection';
import { ContactCTASection } from '@/features/common/ContactCTASection';

const Curriculum: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-muted/30 islamic-pattern">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our <span className="text-gradient-primary">Curriculum</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                A balanced blend of Islamic sciences, Arabic language, and modern academics 
                designed to prepare students for success in both worlds.
              </p>
            </div>
          </div>
        </section>

        <AcademicStructureSection />
        <CurriculumSection />
        <ProgramsSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Curriculum;
