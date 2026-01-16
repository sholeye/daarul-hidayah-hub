/**
 * QuizTake - EPIC Quiz Taking Experience
 * 
 * Features:
 * - Stunning animated UI with progress visualization
 * - Real-time timer with dramatic countdown
 * - Gamified scoring with particle effects
 * - House-themed colors and animations
 * - Full i18n support
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FiClock, FiFlag, FiRefreshCw, FiArrowLeft, FiArrowRight,
  FiCheck, FiX, FiZap, FiAward, FiTarget, FiStar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockCompetitions, sampleQuestions } from '@/data/quizMockData';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HouseName, QuizQuestion } from '@/types/quiz';

// House color themes
const houseThemes: Record<HouseName, { 
  gradient: string; 
  bg: string; 
  ring: string;
  glow: string;
  text: string;
}> = {
  AbuBakr: { 
    gradient: 'from-emerald-500 to-emerald-700', 
    bg: 'bg-emerald-500', 
    ring: 'ring-emerald-500/50',
    glow: 'shadow-emerald-500/30',
    text: 'text-emerald-500'
  },
  Umar: { 
    gradient: 'from-blue-500 to-blue-700', 
    bg: 'bg-blue-500', 
    ring: 'ring-blue-500/50',
    glow: 'shadow-blue-500/30',
    text: 'text-blue-500'
  },
  Uthman: { 
    gradient: 'from-amber-500 to-amber-700', 
    bg: 'bg-amber-500', 
    ring: 'ring-amber-500/50',
    glow: 'shadow-amber-500/30',
    text: 'text-amber-500'
  },
  Ali: { 
    gradient: 'from-rose-500 to-rose-700', 
    bg: 'bg-rose-500', 
    ring: 'ring-rose-500/50',
    glow: 'shadow-rose-500/30',
    text: 'text-rose-500'
  },
};

const inferHouseFromCode = (code: string): HouseName => {
  const prefix = code.slice(0, 2).toUpperCase();
  if (prefix === 'AB') return 'AbuBakr';
  if (prefix === 'UM') return 'Umar';
  if (prefix === 'UT') return 'Uthman';
  if (prefix === 'AL') return 'Ali';
  return 'AbuBakr';
};

const normalize = (value: string) => value.trim().toLowerCase();

// Animated timer component
const AnimatedTimer: React.FC<{ 
  timeLeft: number; 
  maxTime: number;
  theme: typeof houseThemes[HouseName];
}> = ({ timeLeft, maxTime, theme }) => {
  const percentage = (timeLeft / maxTime) * 100;
  const isUrgent = timeLeft <= 10;
  const isCritical = timeLeft <= 5;
  
  return (
    <div className={`relative flex items-center justify-center w-20 h-20 rounded-full bg-card border-4 transition-all duration-300 ${
      isCritical ? 'border-destructive animate-pulse scale-110' : 
      isUrgent ? 'border-amber-500' : 
      `border-muted ${theme.ring}`
    }`}>
      {/* Circular progress */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={`${percentage * 2.26} 226`}
          className={`transition-all duration-1000 ${
            isCritical ? 'text-destructive' : 
            isUrgent ? 'text-amber-500' : 
            theme.text
          }`}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <FiClock className={`w-4 h-4 mb-0.5 ${isCritical ? 'text-destructive' : 'text-muted-foreground'}`} />
        <span className={`text-2xl font-bold ${
          isCritical ? 'text-destructive' : 
          isUrgent ? 'text-amber-500' : 
          'text-foreground'
        }`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

// Score popup animation
const ScorePopup: React.FC<{ 
  points: number; 
  isCorrect: boolean;
  show: boolean;
}> = ({ points, isCorrect, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.8 }}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 p-6 rounded-2xl ${
          isCorrect ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
        }`}
      >
        {isCorrect ? (
          <FiCheck className="w-12 h-12" />
        ) : (
          <FiX className="w-12 h-12" />
        )}
        <span className="text-3xl font-bold">
          {isCorrect ? `+${points}` : '0'} pts
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

export const QuizTake: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [params] = useSearchParams();
  const code = (params.get('code') || '').trim();

  const competition = mockCompetitions.find((c) => c.status === 'upcoming') ?? mockCompetitions[0];
  const rep = competition?.representatives.find((r) => r.loginCode === code);

  const repHouse: HouseName = rep?.house ?? inferHouseFromCode(code);
  const repName = rep?.name ?? 'Demo Representative';
  const theme = houseThemes[repHouse];

  const assignedQuestions = useMemo<QuizQuestion[]>(() => {
    const ids = rep?.assignedQuestions?.length
      ? rep.assignedQuestions
      : sampleQuestions.slice(0, 5).map((q) => q.id);

    const pool = competition?.questions?.length ? competition.questions : sampleQuestions;
    const selected = ids
      .map((id) => pool.find((q) => q.id === id))
      .filter(Boolean) as QuizQuestion[];

    return selected.length ? selected : sampleQuestions.slice(0, 5);
  }, [competition, rep]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; isCorrect: boolean; points: number }>>({});
  const [draft, setDraft] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(assignedQuestions[0]?.timeLimit ?? 30);
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; points: number } | null>(null);

  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const current = assignedQuestions[index];

  // Reset per-question state when question changes
  useEffect(() => {
    if (!current) return;
    setDraft(answers[current.id]?.answer ?? '');
    setTimeLeft(current.timeLimit ?? 30);
    setShowResult(false);
  }, [current?.id]);

  const gradeQuestion = useCallback((q: QuizQuestion, ans: string) => {
    if (!ans.trim()) return { isCorrect: false, points: 0 };
    const isCorrect = normalize(ans) === normalize(q.correctAnswer);
    return { isCorrect, points: isCorrect ? q.points : 0 };
  }, []);

  const totalPossible = useMemo(
    () => assignedQuestions.reduce((sum, q) => sum + (q.points ?? 0), 0),
    [assignedQuestions]
  );

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((sum, a) => sum + a.points, 0);
  }, [answers]);

  const correctCount = useMemo(() => {
    return Object.values(answers).filter(a => a.isCorrect).length;
  }, [answers]);

  const goNext = useCallback(
    (auto = false) => {
      if (!current || finished) return;

      const answerText = auto ? (answers[current.id]?.answer ?? '') : draft;
      const result = gradeQuestion(current, answerText);
      
      setAnswers((prev) => ({ 
        ...prev, 
        [current.id]: { answer: answerText, ...result } 
      }));

      // Show result popup briefly
      setLastResult(result);
      setShowResult(true);
      
      setTimeout(() => {
        setShowResult(false);
        
        if (indexRef.current >= assignedQuestions.length - 1) {
          setFinished(true);
          return;
        }

        setIndex((i) => i + 1);
      }, 800);
    },
    [assignedQuestions.length, current, draft, finished, gradeQuestion, answers]
  );

  const goBack = useCallback(() => {
    if (finished || showResult) return;
    if (index <= 0) return;
    setIndex((i) => Math.max(0, i - 1));
  }, [finished, index, showResult]);

  // Timer
  useEffect(() => {
    if (finished || showResult) return;
    if (!current) return;

    const interval = window.setInterval(() => {
      setTimeLeft((tLeft) => {
        if (tLeft <= 1) {
          window.setTimeout(() => goNext(true), 0);
          return 0;
        }
        return tLeft - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [current?.id, finished, showResult, goNext]);

  // No code provided
  if (!code) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
            <FiTarget className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.representativeLogin}</h1>
          <p className="text-muted-foreground mb-8">{t.missingLoginCode}</p>
          <Link to="/quiz">
            <Button variant="outline" size="lg" className="gap-2">
              <FiArrowLeft className="w-5 h-5" />
              {t.backToPortal}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (!competition || !current) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <FiX className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.error}</h1>
          <p className="text-muted-foreground mb-8">{t.unableToLoadQuestions}</p>
          <Link to="/quiz">
            <Button variant="outline" size="lg" className="gap-2">
              <FiArrowLeft className="w-5 h-5" />
              {t.backToPortal}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Quiz completed - Results screen
  if (finished) {
    const scorePercentage = Math.round((totalScore / totalPossible) * 100);
    const isPerfect = totalScore === totalPossible;
    const isExcellent = scorePercentage >= 80;
    const isGood = scorePercentage >= 60;

    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl overflow-hidden"
        >
          {/* Header with house gradient */}
          <div className={`relative bg-gradient-to-br ${theme.gradient} p-8 text-white overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
              >
                {isPerfect ? (
                  <FiStar className="w-12 h-12" />
                ) : isExcellent ? (
                  <FiAward className="w-12 h-12" />
                ) : (
                  <FiZap className="w-12 h-12" />
                )}
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">{t.quizCompleted}</h1>
              <p className="text-white/80">{repName} • {repHouse}</p>
            </div>
          </div>

          {/* Score display */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              {/* Main score circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className={`relative w-40 h-40 rounded-full flex items-center justify-center ${
                  isPerfect ? 'bg-primary/10 ring-4 ring-primary' :
                  isExcellent ? 'bg-secondary/10 ring-4 ring-secondary' :
                  isGood ? 'bg-accent/10 ring-4 ring-accent' :
                  'bg-muted ring-4 ring-muted-foreground'
                }`}
              >
                <div className="text-center">
                  <span className="text-4xl font-bold text-foreground">{totalScore}</span>
                  <span className="text-lg text-muted-foreground">/{totalPossible}</span>
                  <p className="text-sm text-muted-foreground mt-1">{t.pts}</p>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 rounded-2xl bg-muted/30 text-center"
                >
                  <FiCheck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{correctCount}</p>
                  <p className="text-sm text-muted-foreground">{t.correctAnswer}</p>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-2xl bg-muted/30 text-center"
                >
                  <FiTarget className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{scorePercentage}%</p>
                  <p className="text-sm text-muted-foreground">{t.percentage}</p>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 rounded-2xl bg-muted/30 text-center"
                >
                  <FiAward className={`w-6 h-6 mx-auto mb-2 ${theme.text}`} />
                  <p className="text-2xl font-bold text-foreground">{repHouse}</p>
                  <p className="text-sm text-muted-foreground">{t.house}</p>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 rounded-2xl bg-muted/30 text-center"
                >
                  <FiZap className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{assignedQuestions.length}</p>
                  <p className="text-sm text-muted-foreground">{t.questions}</p>
                </motion.div>
              </div>
            </div>

            {/* Question summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t.questions}</h3>
              <div className="flex flex-wrap gap-2">
                {assignedQuestions.map((q, i) => {
                  const answer = answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        answer?.isCorrect 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quiz" className="flex-1">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <FiArrowLeft className="w-5 h-5" />
                  {t.backToPortal}
                </Button>
              </Link>
              <Button 
                size="lg"
                className="flex-1 gap-2"
                onClick={() => window.location.reload()}
              >
                <FiRefreshCw className="w-5 h-5" />
                {t.retryDemo}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active quiz state
  const questionText = language === 'ar' && current.questionArabic ? current.questionArabic : current.question;
  const progressPercentage = ((index + 1) / assignedQuestions.length) * 100;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-4xl mx-auto">
      {/* Score popup */}
      <ScorePopup 
        points={lastResult?.points ?? 0} 
        isCorrect={lastResult?.isCorrect ?? false} 
        show={showResult} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft"
      >
        {/* Header with house theme */}
        <div className={`relative bg-gradient-to-r ${theme.gradient} p-6 text-white`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{competition.title}</h1>
              <p className="text-white/80 text-sm">{repName} • {repHouse}</p>
            </div>
            <AnimatedTimer timeLeft={timeLeft} maxTime={current.timeLimit ?? 30} theme={theme} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {t.question} {index + 1} / {assignedQuestions.length}
            </span>
            <Badge variant="secondary" className="gap-1">
              <FiZap className="w-3 h-3" />
              {totalScore} {t.pts}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question content */}
        <div className="p-6 md:p-8">
          {/* Question */}
          <motion.div 
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg ${theme.glow}`}>
                {index + 1}
              </div>
              <div className="flex-1 pt-2">
                <Badge variant="outline" className="mb-3 capitalize">
                  {current.type === 'mcq' ? t.mcq : current.type === 'true_false' ? t.trueFalse : t.shortAnswer}
                </Badge>
                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                  {questionText}
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Answer options */}
          <div className="space-y-3 mb-8">
            {current.type === 'mcq' && (current.options ?? []).map((opt, i) => (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                type="button"
                disabled={showResult}
                onClick={() => setDraft(opt)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                  draft === opt 
                    ? `border-primary bg-primary/10 ring-2 ${theme.ring}` 
                    : 'border-border bg-muted/30 hover:border-muted-foreground/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    draft === opt 
                      ? `${theme.bg} text-white` 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className={`text-lg ${draft === opt ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {opt}
                  </span>
                </div>
              </motion.button>
            ))}

            {current.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-4">
                {[{ key: 'True', label: t.trueLabel, icon: FiCheck }, { key: 'False', label: t.falseLabel, icon: FiX }].map((opt, i) => (
                  <motion.button
                    key={opt.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    type="button"
                    disabled={showResult}
                    onClick={() => setDraft(opt.key)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                      draft === opt.key 
                        ? `border-primary bg-primary/10 ring-2 ${theme.ring}` 
                        : 'border-border bg-muted/30 hover:border-muted-foreground/30 hover:bg-muted/50'
                    }`}
                  >
                    <opt.icon className={`w-10 h-10 mx-auto mb-2 ${
                      draft === opt.key ? theme.text : 'text-muted-foreground'
                    }`} />
                    <span className={`block text-lg font-medium ${
                      draft === opt.key ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {opt.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {current.type === 'short_answer' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t.typeYourAnswer}
                  disabled={showResult}
                  className="h-14 text-lg rounded-2xl border-2 focus:ring-2 focus:border-primary"
                />
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={goBack} 
              disabled={index === 0 || showResult}
              className="gap-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              {t.back}
            </Button>
            
            <div className="flex gap-2">
              {assignedQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === index ? `${theme.bg} scale-125` :
                    i < index ? 'bg-primary/50' : 
                    'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button 
              size="lg"
              onClick={() => goNext(false)} 
              disabled={showResult}
              className={`gap-2 ${index >= assignedQuestions.length - 1 ? 'bg-secondary hover:bg-secondary/90' : ''}`}
            >
              {index >= assignedQuestions.length - 1 ? (
                <>
                  <FiFlag className="w-5 h-5" />
                  {t.finish}
                </>
              ) : (
                <>
                  {t.next}
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
