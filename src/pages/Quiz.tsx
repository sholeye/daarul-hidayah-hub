/**
 * Quiz Portal - Public page for quiz competition
 * 
 * Accessible to everyone. Shows:
 * - House leaderboard
 * - Student leaderboard
 * - Upcoming competition
 * - Past winners
 * - Start Quiz button (only enabled at scheduled time for reps)
 */

import React from 'react';
import { Navbar } from '@/features/common/Navbar';
import { Footer } from '@/features/common/Footer';
import { QuizLeaderboard } from '@/features/quiz/QuizLeaderboard';
import { QuizUpcoming } from '@/features/quiz/QuizUpcoming';
import { QuizPastResults } from '@/features/quiz/QuizPastResults';

const Quiz: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 islamic-pattern">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Inter-House <span className="text-gradient-primary">Quiz Competition</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Weekly knowledge competition between the four houses. Test your Islamic knowledge
              and earn points for your house every Sunday!
            </p>
          </div>
        </section>

        {/* Leaderboards */}
        <QuizLeaderboard />

        {/* Upcoming Competition */}
        <QuizUpcoming />

        {/* Past Results */}
        <QuizPastResults />
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
