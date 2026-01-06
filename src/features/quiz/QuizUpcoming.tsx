/**
 * QuizUpcoming - Shows next competition details and login for reps
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUsers, FiPlay, FiLock } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockCompetitions, houses } from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';

// House color mapping
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const QuizUpcoming: React.FC = () => {
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
      
      // Quiz is available 5 minutes before to 2 hours after
      if (diff <= 5 * 60 * 1000 && diff > -2 * 60 * 60 * 1000) {
        setIsQuizTime(true);
        setTimeRemaining('Quiz is LIVE!');
      } else if (diff > 0) {
        setIsQuizTime(false);
        // Calculate time remaining
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days}d ${hrs}h ${mins}m`);
      } else {
        setIsQuizTime(false);
        setTimeRemaining('Competition ended');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [upcomingCompetition]);

  // Handle rep login
  const handleLogin = () => {
    if (!loginCode.trim()) return;
    
    // Find rep with this code
    const rep = upcomingCompetition?.representatives.find(r => r.loginCode === loginCode);
    if (rep && isQuizTime) {
      // Redirect to quiz taking page
      window.location.href = `/quiz/take?code=${loginCode}`;
    }
  };

  if (!upcomingCompetition) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No upcoming competition scheduled.</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Upcoming <span className="text-gradient-secondary">Competition</span>
            </h2>
            <p className="text-muted-foreground">{upcomingCompetition.title}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Competition Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date & Time Card */}
              <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FiCalendar className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled For</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatDate(upcomingCompetition.scheduledDate)}
                      </p>
                      <p className="text-primary font-medium">{upcomingCompetition.scheduledTime}</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full ${isQuizTime ? 'bg-green-500 text-white animate-pulse' : 'bg-muted'}`}>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span className="font-medium">{timeRemaining}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{upcomingCompetition.questions.length}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{upcomingCompetition.repsPerHouse}</p>
                    <p className="text-sm text-muted-foreground">Reps/House</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">30s</p>
                    <p className="text-sm text-muted-foreground">Per Question</p>
                  </div>
                </div>
              </div>

              {/* Representatives by House */}
              <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiUsers className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Representatives</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {houses.map(house => (
                    <div key={house.name} className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-6 h-6 rounded-full ${houseColors[house.name]}`} />
                        <span className="font-semibold text-foreground">{house.name}</span>
                        <span className="text-sm text-muted-foreground">({house.nameArabic})</span>
                      </div>
                      <div className="space-y-1">
                        {repsByHouse[house.name]?.map(rep => (
                          <p key={rep.id} className="text-sm text-muted-foreground pl-8">
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
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6 h-fit sticky top-24">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isQuizTime ? 'bg-green-500/10' : 'bg-muted'
                }`}>
                  {isQuizTime ? (
                    <FiPlay className="w-10 h-10 text-green-500" />
                  ) : (
                    <FiLock className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Representative Login</h3>
                <p className="text-sm text-muted-foreground">
                  {isQuizTime 
                    ? 'Enter your one-time code to start the quiz'
                    : 'Login will be available at scheduled time'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your login code"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                  disabled={!isQuizTime}
                  className="text-center font-mono text-lg"
                />
                
                <Button 
                  variant="hero" 
                  className="w-full"
                  disabled={!isQuizTime || !loginCode.trim()}
                  onClick={handleLogin}
                >
                  {isQuizTime ? 'Start Quiz' : 'Not Available Yet'}
                </Button>
              </div>

              {!isQuizTime && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  The quiz button will be enabled at the scheduled time.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
