/**
 * AdminQuizPage - Quiz competition management for administrators
 * 
 * Features:
 * - Create new competitions
 * - Add/edit questions to question bank
 * - Assign representatives from each house
 * - Generate login credentials for reps
 * - View upcoming and past competitions
 */

import React, { useState } from 'react';
import { 
  FiPlus, FiCalendar, FiClock, FiUsers, FiHelpCircle,
  FiCopy, FiCheck, FiEdit2, FiTrash2, FiChevronDown, FiPlay
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  mockCompetitions, houses, sampleQuestions 
} from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import type { QuizQuestion } from '@/types/quiz';

// House colors
const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const AdminQuizPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'competitions' | 'questions' | 'credentials'>('competitions');
  const [showNewCompetition, setShowNewCompetition] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New competition form state
  const [competitionForm, setCompetitionForm] = useState({
    title: '',
    date: '',
    time: '10:00',
    repsPerHouse: 3,
  });

  // New question form state
  const [questionForm, setQuestionForm] = useState<Partial<QuizQuestion>>({
    question: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10,
    timeLimit: 30,
  });

  // Copy login code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t.codeCopied);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Get upcoming competition
  const upcomingCompetition = mockCompetitions.find(c => c.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.quizManagement}</h1>
          <p className="text-muted-foreground mt-1">Manage quiz competitions, questions, and representatives</p>
        </div>
        <Button onClick={() => setShowNewCompetition(true)} className="gap-2">
          <FiPlus className="w-4 h-4" />
          {t.createCompetition}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: 'competitions', label: 'Competitions', icon: FiCalendar },
          { id: 'questions', label: t.questionBank, icon: FiHelpCircle },
          { id: 'credentials', label: t.loginCredentials, icon: FiUsers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'competitions' && (
        <div className="space-y-6">
          {/* Upcoming Competition */}
          {upcomingCompetition && (
            <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiPlay className="w-6 h-6" />
                    <span className="font-bold text-lg">{t.upcomingCompetition}</span>
                  </div>
                  <Badge className="bg-white/20 text-white">
                    {formatDate(upcomingCompetition.scheduledDate)} • {upcomingCompetition.scheduledTime}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">{upcomingCompetition.title}</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{upcomingCompetition.questions.length}</p>
                    <p className="text-sm text-muted-foreground">{t.questions}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{upcomingCompetition.repsPerHouse}</p>
                    <p className="text-sm text-muted-foreground">{t.repsPerHouse}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{upcomingCompetition.representatives.length}</p>
                    <p className="text-sm text-muted-foreground">{t.representatives}</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-primary">30s</p>
                    <p className="text-sm text-muted-foreground">{t.perQuestion}</p>
                  </div>
                </div>

                {/* Representatives by House */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {houses.map(house => {
                    const reps = upcomingCompetition.representatives.filter(r => r.house === house.name);
                    return (
                      <div key={house.name} className="p-4 rounded-xl bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-4 h-4 rounded-full ${houseColors[house.name]}`} />
                          <span className="font-semibold text-foreground">{house.name}</span>
                        </div>
                        <div className="space-y-2">
                          {reps.map(rep => (
                            <div key={rep.id} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground truncate">{rep.name}</span>
                              {rep.hasCompleted && <FiCheck className="w-4 h-4 text-primary" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* New Competition Form */}
          {showNewCompetition && (
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t.createCompetition}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.competitionTitle}</label>
                  <Input
                    value={competitionForm.title}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, title: e.target.value })}
                    placeholder="Weekly Quiz - Week 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.numberOfReps}</label>
                  <Input
                    type="number"
                    value={competitionForm.repsPerHouse}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, repsPerHouse: parseInt(e.target.value) })}
                    min={1}
                    max={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.scheduleDate}</label>
                  <Input
                    type="date"
                    value={competitionForm.date}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.scheduleTime}</label>
                  <Input
                    type="time"
                    value={competitionForm.time}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => {
                  toast.success('Competition created!');
                  setShowNewCompetition(false);
                }}>
                  {t.save}
                </Button>
                <Button variant="outline" onClick={() => setShowNewCompetition(false)}>
                  {t.cancel}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {sampleQuestions.length} questions in bank
            </p>
            <Button size="sm" onClick={() => setShowNewQuestion(true)} className="gap-2">
              <FiPlus className="w-4 h-4" />
              {t.addQuestion}
            </Button>
          </div>

          {/* New Question Form */}
          {showNewQuestion && (
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t.addQuestion}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.questionType}</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'mcq', label: t.mcq },
                      { value: 'true_false', label: t.trueFalse },
                      { value: 'short_answer', label: t.shortAnswer },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setQuestionForm({ ...questionForm, type: type.value as QuizQuestion['type'] })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questionForm.type === type.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.questionText}</label>
                  <Input
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    placeholder="Enter your question"
                  />
                </div>
                {questionForm.type === 'mcq' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.options}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {questionForm.options?.map((opt, i) => (
                        <Input
                          key={i}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(questionForm.options || [])];
                            newOpts[i] = e.target.value;
                            setQuestionForm({ ...questionForm, options: newOpts });
                          }}
                          placeholder={`Option ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.correctAnswer}</label>
                    <Input
                      value={questionForm.correctAnswer}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                      placeholder="Correct answer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.points}</label>
                    <Input
                      type="number"
                      value={questionForm.points}
                      onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.timeLimit} (s)</label>
                    <Input
                      type="number"
                      value={questionForm.timeLimit}
                      onChange={(e) => setQuestionForm({ ...questionForm, timeLimit: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => {
                  toast.success('Question added!');
                  setShowNewQuestion(false);
                }}>
                  {t.save}
                </Button>
                <Button variant="outline" onClick={() => setShowNewQuestion(false)}>
                  {t.cancel}
                </Button>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-3">
            {sampleQuestions.map((q, index) => (
              <div key={q.id} className="rounded-xl bg-card border border-border p-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{q.question}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="capitalize">{q.type.replace('_', '/')}</Badge>
                    <span className="text-sm text-muted-foreground">{q.points} pts</span>
                    <span className="text-sm text-muted-foreground">{q.timeLimit}s</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FiEdit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Login credentials for the upcoming competition. Share these codes with the representatives.
          </p>

          {upcomingCompetition ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {houses.map(house => {
                const reps = upcomingCompetition.representatives.filter(r => r.house === house.name);
                return (
                  <div key={house.name} className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                    <div className={`${houseColors[house.name]} p-3 text-white`}>
                      <span className="font-bold">{house.name}</span>
                      <span className="text-white/70 text-sm ml-2">({house.nameArabic})</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {reps.map(rep => (
                        <div key={rep.id} className="p-3 rounded-xl bg-muted/50">
                          <p className="font-medium text-foreground text-sm mb-2">{rep.name}</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs font-mono bg-background px-2 py-1 rounded border border-border">
                              {rep.loginCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleCopyCode(rep.loginCode)}
                            >
                              {copiedCode === rep.loginCode ? (
                                <FiCheck className="w-4 h-4 text-primary" />
                              ) : (
                                <FiCopy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming competition. Create one first.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
