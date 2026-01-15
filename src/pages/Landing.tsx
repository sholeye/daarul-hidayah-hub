/**
 * Landing Page - Premium redesigned public-facing page for Daarul Hidayah
 */

import React from 'react';
import { Navbar } from '@/features/common/Navbar';
import { Footer } from '@/features/common/Footer';
import { HeroSection } from '@/features/common/HeroSection';
import { AboutSection } from '@/features/common/AboutSection';
import { IslamicValuesSection } from '@/features/common/IslamicValuesSection';
import { ProgramsSection } from '@/features/common/ProgramsSection';
import { QuizHighlightSection } from '@/features/common/QuizHighlightSection';
import { AnnouncementsSection } from '@/features/common/AnnouncementsSection';
import { ContactCTASection } from '@/features/common/ContactCTASection';
import { GalleryPreview } from '@/features/common/GalleryPreview';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <IslamicValuesSection />
        <ProgramsSection />
        <GalleryPreview />
        <QuizHighlightSection />
        <AnnouncementsSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;