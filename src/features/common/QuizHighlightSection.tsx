/**
 * QuizHighlightSection - Showcases the weekly quiz competition on landing page
 * 
 * Displays house standings, upcoming competition, and CTA to quiz portal.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { houseLeaderboard } from '@/data/quizMockData';

// House color mapping for badges
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const QuizHighlightSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  // Get top 3 houses for display
  const topHouses = houseLeaderboard.slice(0, 4);

  return (
    <section id="quiz" className="py-20 md:py-28 bg-muted/30 islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
            <FiAward className="w-4 h-4" />
            <span>Every Sunday</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.quizCompetition.split(' ')[0]}{' '}
            <span className="text-gradient-secondary">{t.quizCompetition.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.quizSubtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* House Leaderboard Card */}
          <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <FiUsers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.houses}</h3>
                  <p className="text-primary-foreground/70 text-sm">{t.leaderboard}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {topHouses.map((house, index) => (
                <div 
                  key={house.house}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-secondary text-secondary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* House Badge */}
                  <div className={`w-10 h-10 rounded-full ${houseColors[house.house]} flex items-center justify-center text-white font-bold text-sm`}>
                    {house.house.charAt(0)}
                  </div>
                  
                  {/* House Name */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{house.house}</p>
                    <p className="text-xs text-muted-foreground">{house.houseArabic}</p>
                  </div>
                  
                  {/* Score */}
                  <div className={`text-${isRTL ? 'left' : 'right'}`}>
                    <p className="font-bold text-primary">{house.totalScore}</p>
                    <p className="text-xs text-muted-foreground">{house.competitionsWon} wins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Competition & CTA */}
          <div className="space-y-6">
            {/* Next Competition Card */}
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{t.upcomingCompetition}</h3>
                  <p className="text-sm text-muted-foreground">Weekly Quiz - Week 2</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold text-foreground">Sunday, Jan 12, 2025</p>
                  <p className="text-sm text-primary">10:00 AM</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">12</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">Houses</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link to="/quiz" className="block">
              <Button variant="hero" size="xl" className="w-full group">
                {t.viewResults}
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>MCQ Questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>30s Timer</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Live Scoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>House Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
