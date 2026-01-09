/**
 * QuizTake - Representative quiz taking experience (demo-ready, i18n support)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiClock, FiFlag, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCompetitions, sampleQuestions } from '@/data/quizMockData';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HouseName, QuizQuestion } from '@/types/quiz';

const inferHouseFromCode = (code: string): HouseName => {
  const prefix = code.slice(0, 2).toUpperCase();
  if (prefix === 'AB') return 'AbuBakr';
  if (prefix === 'UM') return 'Umar';
  if (prefix === 'UT') return 'Uthman';
  if (prefix === 'AL') return 'Ali';
  return 'AbuBakr';
};

const normalize = (value: string) => value.trim().toLowerCase();

export const QuizTake: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const [params] = useSearchParams();
  const code = (params.get('code') || '').trim();

  const competition = mockCompetitions.find((c) => c.status === 'upcoming') ?? mockCompetitions[0];
  const rep = competition?.representatives.find((r) => r.loginCode === code);

  const repHouse: HouseName = rep?.house ?? inferHouseFromCode(code);
  const repName = rep?.name ?? 'Demo Representative';

  const assignedQuestions = useMemo<QuizQuestion[]>(() => {
    const ids = rep?.assignedQuestions?.length
      ? rep.assignedQuestions
      : sampleQuestions.slice(0, 3).map((q) => q.id);

    const pool = competition?.questions?.length ? competition.questions : sampleQuestions;
    const selected = ids
      .map((id) => pool.find((q) => q.id === id))
      .filter(Boolean) as QuizQuestion[];

    return selected.length ? selected : sampleQuestions.slice(0, 3);
  }, [competition, rep]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(assignedQuestions[0]?.timeLimit ?? 30);
  const [finished, setFinished] = useState(false);

  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const current = assignedQuestions[index];

  // Reset per-question state when question changes
  useEffect(() => {
    if (!current) return;
    setDraft(answers[current.id] ?? '');
    setTimeLeft(current.timeLimit ?? 30);
  }, [current?.id]);

  const gradeQuestion = useCallback((q: QuizQuestion, ans: string) => {
    if (!ans.trim()) return 0;
    const isCorrect = normalize(ans) === normalize(q.correctAnswer);
    return isCorrect ? q.points : 0;
  }, []);

  const totalPossible = useMemo(
    () => assignedQuestions.reduce((sum, q) => sum + (q.points ?? 0), 0),
    [assignedQuestions]
  );

  const totalScore = useMemo(() => {
    if (!finished) return 0;
    return assignedQuestions.reduce((sum, q) => sum + gradeQuestion(q, answers[q.id] ?? ''), 0);
  }, [answers, assignedQuestions, finished, gradeQuestion]);

  const goNext = useCallback(
    (auto = false) => {
      if (!current || finished) return;

      setAnswers((prev) => ({ ...prev, [current.id]: auto ? (prev[current.id] ?? '') : draft }));

      if (indexRef.current >= assignedQuestions.length - 1) {
        setFinished(true);
        return;
      }

      setIndex((i) => i + 1);
    },
    [assignedQuestions.length, current, draft, finished]
  );

  const goBack = useCallback(() => {
    if (finished) return;
    if (index <= 0) return;

    if (current) setAnswers((prev) => ({ ...prev, [current.id]: draft }));
    setIndex((i) => Math.max(0, i - 1));
  }, [current, draft, finished, index]);

  // Timer
  useEffect(() => {
    if (finished) return;
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
  }, [current?.id, finished, goNext]);

  if (!code) {
    return (
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.representativeLogin}</h1>
        <p className="text-muted-foreground mb-6">{t.missingLoginCode}</p>
        <Link to="/quiz">
          <Button variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            {t.backToPortal}
          </Button>
        </Link>
      </div>
    );
  }

  if (!competition || !current) {
    return (
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.error}</h1>
        <p className="text-muted-foreground mb-6">{t.unableToLoadQuestions}</p>
        <Link to="/quiz">
          <Button variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            {t.backToPortal}
          </Button>
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{t.quizCompleted}</h1>
            <p className="text-muted-foreground">
              {repName} • {repHouse}
            </p>
          </div>
          <Badge variant={totalScore === totalPossible ? 'paid' : 'present'}>
            {totalScore}/{totalPossible} {t.pts}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">{t.questions}</p>
            <p className="text-2xl font-bold text-foreground">{assignedQuestions.length}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">{t.house}</p>
            <p className="text-2xl font-bold text-foreground">{repHouse}</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">{t.score}</p>
            <p className="text-2xl font-bold text-foreground">{totalScore}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/quiz" className="flex-1">
            <Button className="w-full" variant="outline">
              {t.backToPortal}
            </Button>
          </Link>
          <Button className="flex-1" onClick={() => window.location.reload()}>
            <FiRefreshCw className="w-4 h-4 mr-2" />
            {t.retryDemo}
          </Button>
        </div>
      </div>
    );
  }

  const questionText = language === 'ar' && current.questionArabic ? current.questionArabic : current.question;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{competition.title}</h1>
            <p className="text-sm text-muted-foreground">{repName} • {repHouse}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2">
              <FiClock className="w-4 h-4" />
              {timeLeft}s
            </Badge>
            <Badge variant="secondary">
              {index + 1}/{assignedQuestions.length}
            </Badge>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-xl bg-muted/30 p-5 mb-6">
          <p className="text-sm text-muted-foreground mb-2">{t.question} {index + 1}</p>
          <p className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">{questionText}</p>
        </div>

        {/* Answer UI */}
        <div className="space-y-3 mb-8">
          {current.type === 'mcq' && (current.options ?? []).map((opt) => (
            <Button
              key={opt}
              type="button"
              variant={draft === opt ? 'default' : 'outline'}
              className="w-full justify-start h-auto py-4 px-4 whitespace-normal"
              onClick={() => setDraft(opt)}
            >
              {opt}
            </Button>
          ))}

          {current.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-3">
              {[{ key: 'True', label: t.trueLabel }, { key: 'False', label: t.falseLabel }].map((opt) => (
                <Button
                  key={opt.key}
                  type="button"
                  variant={draft === opt.key ? 'default' : 'outline'}
                  className="h-12"
                  onClick={() => setDraft(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          )}

          {current.type === 'short_answer' && (
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.typeYourAnswer}
              className="h-12"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={goBack} disabled={index === 0}>
            <FiArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
          <div className="flex-1" />
          <Button onClick={() => goNext(false)} className="sm:min-w-[180px]">
            {index >= assignedQuestions.length - 1 ? (
              <>
                <FiFlag className="w-4 h-4 mr-2" />
                {t.finish}
              </>
            ) : (
              <>
                {t.next}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
