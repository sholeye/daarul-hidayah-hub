/**
 * QuizPastResults - Shows past competition winners and results
 */

import React from 'react';
import { FiAward, FiStar, FiCalendar } from 'react-icons/fi';
import { mockCompetitionResults } from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';

// House color mapping
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const QuizPastResults: React.FC = () => {
  if (mockCompetitionResults.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No past competitions yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Past <span className="text-gradient-primary">Winners</span>
            </h2>
            <p className="text-muted-foreground">Recent competition results</p>
          </div>

          {/* Results List */}
          <div className="space-y-6">
            {mockCompetitionResults.map((result, index) => (
              <div 
                key={result.competitionId}
                className="rounded-2xl bg-card border border-border shadow-soft p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{formatDate(result.completedAt)}</span>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                    Week {mockCompetitionResults.length - index}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Winning House */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                    <div className={`w-16 h-16 rounded-full ${houseColors[result.winningHouse]} flex items-center justify-center`}>
                      <FiAward className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Winning House</p>
                      <p className="text-xl font-bold text-foreground">{result.winningHouse}</p>
                      <p className="text-primary font-medium">{result.houseScores[result.winningHouse]} pts</p>
                    </div>
                  </div>

                  {/* Top Student */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                      <FiStar className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Top Student</p>
                      <p className="text-xl font-bold text-foreground">{result.topStudent.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${houseColors[result.topStudent.house]}`} />
                        <span className="text-sm text-muted-foreground">{result.topStudent.score} pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* All House Scores */}
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {Object.entries(result.houseScores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([house, score], i) => (
                      <div 
                        key={house}
                        className={`text-center p-2 rounded-lg ${
                          i === 0 ? 'bg-primary/10' : 'bg-muted/30'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${houseColors[house]} mx-auto mb-1`} />
                        <p className="text-xs text-muted-foreground">{house}</p>
                        <p className="font-bold text-foreground">{score}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
