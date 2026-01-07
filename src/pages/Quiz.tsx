/**
 * Quiz Portal - Public page for quiz competition
 * 
 * Accessible to everyone. Shows:
 * - House leaderboard with beautiful cards
 * - Student leaderboard
 * - Upcoming competition details
 * - Past winners
 * - Start Quiz button (only enabled at scheduled time for reps)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiTrendingUp, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Navbar } from '@/features/common/Navbar';
import { Footer } from '@/features/common/Footer';
import { QuizLeaderboard } from '@/features/quiz/QuizLeaderboard';
import { QuizUpcoming } from '@/features/quiz/QuizUpcoming';
import { QuizPastResults } from '@/features/quiz/QuizPastResults';
import { useLanguage } from '@/contexts/LanguageContext';
import { houses } from '@/data/quizMockData';

// House gradient colors for hero cards
const houseGradients: Record<string, string> = {
  AbuBakr: 'from-emerald-500 to-emerald-700',
  Umar: 'from-blue-500 to-blue-700',
  Uthman: 'from-amber-500 to-amber-700',
  Ali: 'from-rose-500 to-rose-700',
};

const Quiz: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section - Modern, Clean Design */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 islamic-pattern opacity-30" />
          
          {/* Decorative blobs */}
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <FiAward className="w-4 h-4" />
                <span>Every Sunday</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t.quizCompetition.split(' ').slice(0, 2).join(' ')} {' '}
                <span className="text-gradient-primary">{t.quizCompetition.split(' ').slice(2).join(' ')}</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t.quizSubtitle}
              </p>
            </div>

            {/* House Cards - Horizontal Scroll on Mobile */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
              {houses.map((house, index) => (
                <div 
                  key={house.name}
                  className={`flex-shrink-0 w-[200px] md:w-auto snap-center rounded-2xl bg-gradient-to-br ${houseGradients[house.name]} p-5 text-white shadow-lg transform hover:scale-105 transition-transform duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {house.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <span className="text-white/70 text-xs block">Rank</span>
                      <span className="text-xl font-bold">#{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{house.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{house.nameArabic}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold">{house.totalScore}</span>
                      <span className="text-white/70 text-sm ml-1">{t.pts}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/70 text-xs">{house.competitionsWon} {t.wins}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="py-8 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: t.houses, value: '4', icon: '🏠' },
                { label: t.students, value: '50+', icon: '👨‍🎓' },
                { label: 'Competitions', value: '12', icon: '🏆' },
                { label: t.questions, value: '200+', icon: '❓' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboards */}
        <QuizLeaderboard />

        {/* Upcoming Competition */}
        <QuizUpcoming />

        {/* Past Results */}
        <QuizPastResults />

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Compete?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              If you're a representative, get your login code from your house captain and join the next competition!
            </p>
            <Link 
              to="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
            >
              Contact Us
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
