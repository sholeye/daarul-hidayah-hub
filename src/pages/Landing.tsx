/**
 * Landing Page - Main public-facing page for Daarul Hidayah
 */

import React from 'react';
import { Navbar } from '@/features/common/Navbar';
import { Footer } from '@/features/common/Footer';
import { HeroSection } from '@/features/common/HeroSection';
import { AboutSection } from '@/features/common/AboutSection';
import { AcademicStructureSection } from '@/features/common/AcademicStructureSection';
import { IslamicValuesSection } from '@/features/common/IslamicValuesSection';
import { CurriculumSection } from '@/features/common/CurriculumSection';
import { ProgramsSection } from '@/features/common/ProgramsSection';
import { QuizHighlightSection } from '@/features/common/QuizHighlightSection';
import { EventsSection } from '@/features/common/EventsSection';
import { AnnouncementsSection } from '@/features/common/AnnouncementsSection';
import { ContactCTASection } from '@/features/common/ContactCTASection';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <AcademicStructureSection />
        <IslamicValuesSection />
        <CurriculumSection />
        <ProgramsSection />
        <QuizHighlightSection />
        <EventsSection />
        <AnnouncementsSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
