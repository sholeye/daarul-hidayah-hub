import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiAward } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden islamic-pattern">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <FiBookOpen className="w-4 h-4" />
            <span>Established Islamic Education</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
            Daarul Hidayah
            <span className="block text-gradient-primary mt-2">
              Islamic & Arabic School
            </span>
          </h1>

          {/* Arabic Motto */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
            دار الهداية
          </p>

          {/* English Motto */}
          <p className="text-lg md:text-xl text-muted-foreground/80 italic mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            "Learn for servitude to Allah and Sincerity of Religion"
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Enroll Your Child
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/curriculum">
              <Button variant="outline" size="xl">
                View Curriculum
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">6</p>
              <p className="text-sm text-muted-foreground mt-1">Classes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">2</p>
              <p className="text-sm text-muted-foreground mt-1">Programs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-secondary">100+</p>
              <p className="text-sm text-muted-foreground mt-1">Students</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <FiAward className="text-3xl md:text-4xl text-accent" />
              <p className="text-sm text-muted-foreground mt-1">Quality Education</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
