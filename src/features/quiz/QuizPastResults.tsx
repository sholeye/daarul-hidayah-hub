/**
 * QuizPastResults - Past competition winners display
 * 
 * Clean cards showing recent competition results
 */

import React from 'react';
import { FiAward, FiStar, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { mockCompetitionResults } from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';
import { useLanguage } from '@/contexts/LanguageContext';

// House colors
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const QuizPastResults: React.FC = () => {
  const { t } = useLanguage();

  if (mockCompetitionResults.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">{t.noPastResults}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t.pastWinners}
          </h2>
          <p className="text-muted-foreground">{t.recentResults}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {mockCompetitionResults.map((result, index) => (
              <div 
                key={result.competitionId}
                className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden hover:shadow-medium transition-shadow"
              >
                {/* Header */}
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FiCalendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(result.completedAt)}</span>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {t.week} {mockCompetitionResults.length - index}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Winning House */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${houseColors[result.winningHouse]} flex items-center justify-center shadow-lg`}>
                        <FiAward className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.winningHouse}</p>
                        <p className="text-xl font-bold text-foreground">{result.winningHouse}</p>
                        <p className="text-primary font-semibold">{result.houseScores[result.winningHouse]} {t.pts}</p>
                      </div>
                    </div>

                    {/* Top Student */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                        <FiStar className="w-8 h-8 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.topStudent}</p>
                        <p className="text-xl font-bold text-foreground">{result.topStudent.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${houseColors[result.topStudent.house]}`} />
                          <span className="text-sm text-muted-foreground">{result.topStudent.score} {t.pts}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All House Scores */}
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(result.houseScores)
                      .sort(([, a], [, b]) => b - a)
                      .map(([house, score], i) => (
                        <div 
                          key={house}
                          className={`text-center p-3 rounded-xl ${
                            i === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full ${houseColors[house]} mx-auto mb-2`} />
                          <p className="text-xs text-muted-foreground mb-1">{house}</p>
                          <p className="font-bold text-foreground">{score}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
