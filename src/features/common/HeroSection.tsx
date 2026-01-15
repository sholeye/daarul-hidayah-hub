/**
 * HeroSection - Premium landing hero with stunning animations
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiAward, FiUsers, FiStar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const stats = [
    { value: '6', label: t.classes, icon: FiBookOpen },
    { value: '2', label: t.programs, icon: FiStar },
    { value: '100+', label: t.students, icon: FiUsers },
    { value: '', label: t.qualityEducation, icon: FiAward },
  ];

  return (
    <section 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Animated Decorative Elements */}
      <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-bounce-in backdrop-blur-sm">
            <FiBookOpen className="w-4 h-4" />
            <span>{t.establishedEducation}</span>
          </div>

          {/* Main Heading with Gradient */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
            <span className="text-gradient-primary">{t.schoolName}</span>
            <span className="block text-3xl md:text-4xl lg:text-5xl mt-3 font-semibold text-foreground/80">
              {t.schoolSubtitle}
            </span>
          </h1>

          {/* Arabic Motto with Elegant Styling */}
          <div className="mb-6 animate-slide-up delay-100">
            <p className="text-2xl md:text-3xl text-secondary font-bold mb-2">
              {t.arabicMotto}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground italic">
              {t.englishMotto}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-200">
            {t.heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-300">
            <Link to="/contact">
              <Button variant="hero" size="xl" className="btn-glow group">
                {t.enrollChild}
                <FiArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Button>
            </Link>
            <Link to="/curriculum">
              <Button variant="outline" size="xl" className="border-2 hover:bg-primary/5">
                {t.viewCurriculum}
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-slide-up delay-400">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex flex-col items-center">
                  {stat.value ? (
                    <p className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">
                      {stat.value}
                    </p>
                  ) : (
                    <stat.icon className="w-10 h-10 text-secondary mb-2" />
                  )}
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};