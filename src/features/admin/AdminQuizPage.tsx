/**
 * AdminQuizPage - Enhanced Quiz Management Dashboard
 */

import React, { useState } from 'react';
import { 
  FiPlus, FiCalendar, FiClock, FiUsers, FiHelpCircle,
  FiCopy, FiCheck, FiEdit2, FiTrash2, FiPlay, FiEye,
  FiDownload, FiUpload, FiBarChart2, FiAward, FiZap
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  mockCompetitions, houses, sampleQuestions, houseLeaderboard 
} from '@/data/quizMockData';
import { formatDate } from '@/utils/helpers';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import type { QuizQuestion } from '@/types/quiz';

const houseColors: Record<string, string> = {
  AbuBakr: 'bg-emerald-500',
  Umar: 'bg-blue-500',
  Uthman: 'bg-amber-500',
  Ali: 'bg-rose-500',
};

export const AdminQuizPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'competitions' | 'questions' | 'credentials' | 'grading' | 'analytics'>('competitions');
  const [showNewCompetition, setShowNewCompetition] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [competitionForm, setCompetitionForm] = useState({
    title: '',
    date: '',
    time: '10:00',
    repsPerHouse: 3,
  });

  const [questionForm, setQuestionForm] = useState<Partial<QuizQuestion>>({
    question: '',
    questionArabic: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10,
    timeLimit: 30,
    maxPoints: 20,
    rubric: '',
    rubricArabic: '',
  });

  // Mock pending essay grades
  const [pendingEssays, setPendingEssays] = useState([
    { id: '1', repName: 'Ahmad Ibrahim', house: 'AbuBakr' as const, question: 'Explain the significance of the Hijrah in Islamic history.', answer: 'The Hijrah marks the migration of Prophet Muhammad (SAW) from Makkah to Madinah in 622 CE. It represents a turning point in Islamic history as it established the first Islamic state and community...', maxPoints: 20, submittedAt: '2025-01-12T10:15:00' },
    { id: '2', repName: 'Khalid Mustafa', house: 'Umar' as const, question: 'Discuss the importance of Salah in the life of a Muslim.', answer: 'Salah is the second pillar of Islam and is obligatory for every Muslim. It is a direct connection between the worshipper and Allah, performed five times daily...', maxPoints: 20, submittedAt: '2025-01-12T10:18:00' },
  ]);
  const [gradingEssay, setGradingEssay] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState(0);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t.codeCopied);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const upcomingCompetition = mockCompetitions.find(c => c.status === 'upcoming');

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t.quizManagement}</h1>
          <p className="text-muted-foreground mt-1">{t.quizSubtitle}</p>
        </div>
        <Button onClick={() => setShowNewCompetition(true)} className="gap-2">
          <FiPlus className="w-4 h-4" />
          {t.createCompetition}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border">
          <FiCalendar className="w-8 h-8 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-sm text-muted-foreground">{t.upcomingCompetition}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <FiHelpCircle className="w-8 h-8 text-secondary mb-2" />
          <p className="text-2xl font-bold text-foreground">{sampleQuestions.length}</p>
          <p className="text-sm text-muted-foreground">{t.questionBank}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <FiUsers className="w-8 h-8 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">48</p>
          <p className="text-sm text-muted-foreground">{t.representatives}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border">
          <FiAward className="w-8 h-8 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">4</p>
          <p className="text-sm text-muted-foreground">{t.houses}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: 'competitions', label: t.upcomingCompetition, icon: FiCalendar },
          { id: 'questions', label: t.questionBank, icon: FiHelpCircle },
          { id: 'credentials', label: t.loginCredentials, icon: FiUsers },
          { id: 'grading', label: t.essayGrading, icon: FiEdit2 },
          { id: 'analytics', label: t.leaderboard, icon: FiBarChart2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.id === 'grading' && pendingEssays.length > 0 && (
              <Badge variant="secondary" className="ml-1">{pendingEssays.length}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Competitions Tab */}
      {activeTab === 'competitions' && (
        <div className="space-y-6">
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
                <Button onClick={() => { toast.success(t.success); setShowNewCompetition(false); }}>
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

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">{sampleQuestions.length} {t.questions}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2">
                <FiUpload className="w-4 h-4" />
                {t.add}
              </Button>
              <Button size="sm" onClick={() => setShowNewQuestion(true)} className="gap-2">
                <FiPlus className="w-4 h-4" />
                {t.addQuestion}
              </Button>
            </div>
          </div>

          {showNewQuestion && (
            <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t.addQuestion}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.questionType}</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'mcq', label: t.mcq },
                      { value: 'true_false', label: t.trueFalse },
                      { value: 'short_answer', label: t.shortAnswer },
                      { value: 'essay', label: t.essayQuestion },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.questionText} (EN)</label>
                    <Input
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      placeholder="Enter question in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.questionText} (AR)</label>
                    <Input
                      value={questionForm.questionArabic}
                      onChange={(e) => setQuestionForm({ ...questionForm, questionArabic: e.target.value })}
                      placeholder="أدخل السؤال بالعربية"
                      dir="rtl"
                    />
                  </div>
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
                          placeholder={`${t.options} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* Essay-specific fields */}
                {questionForm.type === 'essay' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t.rubric} (EN)</label>
                        <textarea
                          value={questionForm.rubric || ''}
                          onChange={(e) => setQuestionForm({ ...questionForm, rubric: e.target.value })}
                          className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                          placeholder="Grading criteria for this essay question..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t.rubric} (AR)</label>
                        <textarea
                          value={questionForm.rubricArabic || ''}
                          onChange={(e) => setQuestionForm({ ...questionForm, rubricArabic: e.target.value })}
                          className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                          placeholder="معايير التقييم لهذا السؤال..."
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-xl">
                      <p className="text-sm text-muted-foreground">
                        <FiEdit2 className="inline w-4 h-4 mr-2" />
                        Essay questions require manual grading by the quiz master after submission.
                      </p>
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {questionForm.type !== 'essay' && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t.correctAnswer}</label>
                      <Input
                        value={questionForm.correctAnswer}
                        onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {questionForm.type === 'essay' ? t.maxScore : t.points}
                    </label>
                    <Input
                      type="number"
                      value={questionForm.type === 'essay' ? questionForm.maxPoints : questionForm.points}
                      onChange={(e) => setQuestionForm({ 
                        ...questionForm, 
                        [questionForm.type === 'essay' ? 'maxPoints' : 'points']: parseInt(e.target.value) 
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t.timeLimit} (s)</label>
                    <Input
                      type="number"
                      value={questionForm.timeLimit}
                      onChange={(e) => setQuestionForm({ ...questionForm, timeLimit: parseInt(e.target.value) })}
                      placeholder={questionForm.type === 'essay' ? '180' : '30'}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => { toast.success(t.success); setShowNewQuestion(false); }}>
                  {t.save}
                </Button>
                <Button variant="outline" onClick={() => setShowNewQuestion(false)}>
                  {t.cancel}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {sampleQuestions.map((q, index) => (
              <div key={q.id} className="rounded-xl bg-card border border-border p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{q.question}</p>
                  {q.questionArabic && (
                    <p className="text-sm text-muted-foreground mt-1" dir="rtl">{q.questionArabic}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="capitalize">{q.type.replace('_', '/')}</Badge>
                    <span className="text-sm text-muted-foreground">{q.points} {t.pts}</span>
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

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <p className="text-muted-foreground">{t.loginCredentials}</p>

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
                                <FiCheck className="w-3 h-3 text-primary" />
                              ) : (
                                <FiCopy className="w-3 h-3" />
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
            <p className="text-center text-muted-foreground py-8">{t.noUpcoming}</p>
          )}
        </div>
      )}

      {/* Essay Grading Tab */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          {pendingEssays.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{pendingEssays.length} {t.pendingGrading}</p>
              </div>
              
              {pendingEssays.map((essay) => (
                <div key={essay.id} className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                  <div className={`${houseColors[essay.house]} p-4 text-white`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="font-bold">{essay.repName[0]}</span>
                        </div>
                        <div>
                          <p className="font-bold">{essay.repName}</p>
                          <p className="text-white/70 text-sm">{essay.house}</p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white w-fit">{t.awaitingGrade}</Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t.question}</h4>
                      <p className="text-muted-foreground">{essay.question}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t.essayAnswer}</h4>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <p className="text-foreground whitespace-pre-wrap">{essay.answer}</p>
                      </div>
                    </div>
                    
                    {gradingEssay === essay.id ? (
                      <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              {t.score} (0-{essay.maxPoints})
                            </label>
                            <Input
                              type="number"
                              value={gradeScore}
                              onChange={(e) => setGradeScore(Math.min(essay.maxPoints, Math.max(0, parseInt(e.target.value) || 0)))}
                              min={0}
                              max={essay.maxPoints}
                            />
                          </div>
                          <div className="flex items-end">
                            <Progress value={(gradeScore / essay.maxPoints) * 100} className="h-3 flex-1" />
                            <span className="ml-3 font-bold text-foreground">{gradeScore}/{essay.maxPoints}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">{t.graderFeedback}</label>
                          <textarea
                            value={gradeFeedback}
                            onChange={(e) => setGradeFeedback(e.target.value)}
                            className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                            placeholder="Provide feedback for the student..."
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => {
                              setPendingEssays(pendingEssays.filter(e => e.id !== essay.id));
                              setGradingEssay(null);
                              setGradeScore(0);
                              setGradeFeedback('');
                              toast.success(t.success);
                            }}
                          >
                            <FiCheck className="w-4 h-4 mr-2" />
                            {t.submitGrade}
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setGradingEssay(null);
                            setGradeScore(0);
                            setGradeFeedback('');
                          }}>
                            {t.cancel}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{t.maxScore}: {essay.maxPoints} {t.pts}</p>
                        <Button onClick={() => setGradingEssay(essay.id)}>
                          <FiEdit2 className="w-4 h-4 mr-2" />
                          {t.gradeNow}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <FiCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.success}</h3>
              <p className="text-muted-foreground">{t.noDataAvailable}</p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t.houseStandings}</h3>
              <div className="space-y-4">
                {houseLeaderboard.map((house, index) => (
                  <div key={house.house} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${houseColors[house.house]} flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-foreground">{house.house}</span>
                        <span className="text-primary font-bold">{house.totalScore} {t.pts}</span>
                      </div>
                      <Progress value={(house.totalScore / 500) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{t.topStudents}</h3>
              <div className="space-y-3">
                {[
                  { name: 'Ahmad Ibrahim', house: 'AbuBakr', score: 120 },
                  { name: 'Khalid Mustafa', house: 'Umar', score: 115 },
                  { name: 'Salman Hasan', house: 'Ali', score: 110 },
                ].map((student, index) => (
                  <div key={student.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${houseColors[student.house]}`} />
                        <span className="text-sm text-muted-foreground">{student.house}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{student.score} {t.pts}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
