/**
 * QuizPastResults - Latest competition winners display
 */

import React from 'react';
import { FiAward, FiStar, FiCalendar } from 'react-icons/fi';
import { mockCompetitionResults } from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';
import { useLanguage } from '@/contexts/LanguageContext';

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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">{t.noPastResults}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t.latestWinners}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">{t.recentResults}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {mockCompetitionResults.map((result, index) => (
              <div 
                key={result.competitionId}
                className="rounded-xl bg-card border border-border shadow-soft overflow-hidden hover:shadow-medium transition-shadow"
              >
                <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FiCalendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{formatDate(result.completedAt)}</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {t.week} {mockCompetitionResults.length - index}
                  </span>
                </div>

                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${houseColors[result.winningHouse]} flex items-center justify-center shadow-md`}>
                        <FiAward className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t.winningHouse}</p>
                        <p className="text-lg font-bold text-foreground">{result.winningHouse}</p>
                        <p className="text-primary font-semibold text-sm">{result.houseScores[result.winningHouse]} {t.pts}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <FiStar className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t.topStudent}</p>
                        <p className="text-lg font-bold text-foreground">{result.topStudent.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${houseColors[result.topStudent.house]}`} />
                          <span className="text-xs text-muted-foreground">{result.topStudent.score} {t.pts}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(result.houseScores)
                      .sort(([, a], [, b]) => b - a)
                      .map(([house, score], i) => (
                        <div 
                          key={house}
                          className={`text-center p-2 rounded-lg ${
                            i === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full ${houseColors[house]} mx-auto mb-1`} />
                          <p className="text-xs text-muted-foreground mb-0.5">{house}</p>
                          <p className="font-bold text-foreground text-sm">{score}</p>
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
