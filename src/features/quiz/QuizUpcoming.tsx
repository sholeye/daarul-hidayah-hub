/**
 * QuizUpcoming - Shows next competition details and rep login
 * 
 * Clean, minimal design with focus on key information
 */

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers, FiPlay, FiLock, FiAlertCircle } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCompetitions, houses } from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';
import { useLanguage } from '@/contexts/LanguageContext';

// House colors
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const QuizUpcoming: React.FC = () => {
  const { t } = useLanguage();
  const [loginCode, setLoginCode] = useState('');
  const [isQuizTime, setIsQuizTime] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Get upcoming competition
  const upcomingCompetition = mockCompetitions.find(c => c.status === 'upcoming');

  // Check if current time matches scheduled quiz time
  useEffect(() => {
    if (!upcomingCompetition) return;

    const checkTime = () => {
      const now = new Date();
      const [hours, minutes] = upcomingCompetition.scheduledTime.split(':').map(Number);
      const scheduledDate = new Date(upcomingCompetition.scheduledDate);
      scheduledDate.setHours(hours, minutes, 0, 0);

      const diff = scheduledDate.getTime() - now.getTime();
      
      // Quiz available 5 min before to 2 hours after
      if (diff <= 5 * 60 * 1000 && diff > -2 * 60 * 60 * 1000) {
        setIsQuizTime(true);
        setTimeRemaining(t.quizIsLive);
      } else if (diff > 0) {
        setIsQuizTime(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days}d ${hrs}h ${mins}m`);
      } else {
        setIsQuizTime(false);
        setTimeRemaining(t.competitionEnded);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [upcomingCompetition, t]);

  // Handle rep login
  const handleLogin = () => {
    if (!loginCode.trim()) return;
    const rep = upcomingCompetition?.representatives.find(r => r.loginCode === loginCode);
    if (rep && isQuizTime) {
      window.location.href = `/quiz/take?code=${loginCode}`;
    }
  };

  if (!upcomingCompetition) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t.noUpcoming}</p>
          </div>
        </div>
      </section>
    );
  }

  // Group reps by house
  const repsByHouse = houses.reduce((acc, house) => {
    acc[house.name] = upcomingCompetition.representatives.filter(r => r.house === house.name);
    return acc;
  }, {} as Record<string, typeof upcomingCompetition.representatives>);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t.upcomingCompetition}
          </h2>
          <p className="text-muted-foreground">{upcomingCompetition.title}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Competition Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date/Time and Stats Card */}
              <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  {/* Date & Time */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FiCalendar className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t.scheduledFor}</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatDate(upcomingCompetition.scheduledDate)}
                      </p>
                      <p className="text-primary font-medium">{upcomingCompetition.scheduledTime}</p>
                    </div>
                  </div>
                  
                  {/* Countdown */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                    isQuizTime 
                      ? 'bg-green-500 text-white animate-pulse' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <FiClock className="w-4 h-4" />
                    <span>{timeRemaining}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">{upcomingCompetition.questions.length}</p>
                    <p className="text-sm text-muted-foreground">{t.questions}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">{upcomingCompetition.repsPerHouse}</p>
                    <p className="text-sm text-muted-foreground">{t.repsPerHouse}</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">30s</p>
                    <p className="text-sm text-muted-foreground">{t.perQuestion}</p>
                  </div>
                </div>
              </div>

              {/* Representatives Grid */}
              <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiUsers className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">{t.representatives}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {houses.map(house => (
                    <div key={house.name} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-4 h-4 rounded-full ${houseColors[house.name]}`} />
                        <span className="font-semibold text-sm text-foreground">{house.name}</span>
                      </div>
                      <div className="space-y-1.5">
                        {repsByHouse[house.name]?.map(rep => (
                          <p key={rep.id} className="text-sm text-muted-foreground truncate">
                            {rep.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rep Login Card */}
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6 h-fit lg:sticky lg:top-24">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  isQuizTime ? 'bg-green-500/10' : 'bg-muted'
                }`}>
                  {isQuizTime ? (
                    <FiPlay className="w-10 h-10 text-green-500" />
                  ) : (
                    <FiLock className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t.representativeLogin}</h3>
                <p className="text-sm text-muted-foreground">
                  {isQuizTime ? t.enterLoginCode : t.loginAvailableAtTime}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="XX-0000-000"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                  disabled={!isQuizTime}
                  className="text-center font-mono text-lg h-12"
                />
                
                <Button 
                  className="w-full h-12"
                  disabled={!isQuizTime || !loginCode.trim()}
                  onClick={handleLogin}
                >
                  {isQuizTime ? t.startQuiz : t.notAvailableYet}
                </Button>
              </div>

              {!isQuizTime && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  {t.quizButtonEnabled}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
