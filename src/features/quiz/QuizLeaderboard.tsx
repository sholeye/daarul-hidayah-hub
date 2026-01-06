/**
 * QuizLeaderboard - Displays house and student rankings
 */

import React from 'react';
import { FiAward, FiTrendingUp } from 'react-icons/fi';
import { houseLeaderboard, studentLeaderboard, houses } from '@/data/quizMockData';

// House color mapping
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const QuizLeaderboard: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* House Leaderboard */}
          <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
              <div className="flex items-center gap-3">
                <FiAward className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">House Standings</h2>
                  <p className="text-primary-foreground/70 text-sm">Overall rankings</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {houseLeaderboard.map((house, index) => (
                <div 
                  key={house.house}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    index === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-secondary text-secondary-foreground' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>

                  {/* House Icon */}
                  <div className={`w-12 h-12 rounded-full ${houseColors[house.house]} flex items-center justify-center text-white font-bold`}>
                    {house.house.charAt(0)}
                  </div>

                  {/* House Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{house.house}</p>
                    <p className="text-sm text-muted-foreground">{house.houseArabic}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{house.totalScore}</p>
                    <p className="text-xs text-muted-foreground">{house.competitionsWon} wins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Leaderboard */}
          <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
            <div className="bg-gradient-to-r from-secondary to-secondary/80 p-6 text-secondary-foreground">
              <div className="flex items-center gap-3">
                <FiTrendingUp className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Top Students</h2>
                  <p className="text-secondary-foreground/70 text-sm">Individual rankings</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {studentLeaderboard.map((student, index) => (
                <div 
                  key={student.name}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    index === 0 ? 'bg-secondary/5 border border-secondary/20' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-secondary text-secondary-foreground' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${houseColors[student.house]}`} />
                      <span className="text-sm text-muted-foreground">{student.house}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-secondary">{student.totalScore}</p>
                    <p className="text-xs text-muted-foreground">{student.competitionsParticipated} quizzes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
