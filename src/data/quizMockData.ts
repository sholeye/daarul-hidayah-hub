/**
 * Mock Data for Quiz Competition System
 * 
 * Contains sample houses, competitions, questions, and results
 * for development and testing purposes.
 */

import type { 
  House, 
  QuizCompetition, 
  QuizQuestion, 
  QuizRepresentative,
  CompetitionResult,
  LeaderboardEntry,
  StudentLeaderEntry 
} from '@/types/quiz';

// The four houses
export const houses: House[] = [
  {
    id: '1',
    name: 'AbuBakr',
    nameArabic: 'أبو بكر',
    color: 'bg-emerald-500',
    totalScore: 450,
    competitionsWon: 5,
  },
  {
    id: '2',
    name: 'Umar',
    nameArabic: 'عمر',
    color: 'bg-blue-500',
    totalScore: 420,
    competitionsWon: 4,
  },
  {
    id: '3',
    name: 'Uthman',
    nameArabic: 'عثمان',
    color: 'bg-amber-500',
    totalScore: 380,
    competitionsWon: 3,
  },
  {
    id: '4',
    name: 'Ali',
    nameArabic: 'علي',
    color: 'bg-rose-500',
    totalScore: 400,
    competitionsWon: 4,
  },
];

// Sample questions pool
export const sampleQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How many pillars of Islam are there?',
    questionArabic: 'كم عدد أركان الإسلام؟',
    type: 'mcq',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q2',
    question: 'The Prophet Muhammad (SAW) was born in Makkah.',
    questionArabic: 'ولد النبي محمد ﷺ في مكة.',
    type: 'true_false',
    options: ['True', 'False'],
    correctAnswer: 'True',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q3',
    question: 'What is the first surah of the Quran?',
    questionArabic: 'ما هي أول سورة في القرآن؟',
    type: 'short_answer',
    correctAnswer: 'Al-Fatiha',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q4',
    question: 'Which month is Ramadan in the Islamic calendar?',
    questionArabic: 'أي شهر هو رمضان في التقويم الإسلامي؟',
    type: 'mcq',
    options: ['7th', '8th', '9th', '10th'],
    correctAnswer: '9th',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q5',
    question: 'Zakat is obligatory for every Muslim regardless of wealth.',
    questionArabic: 'الزكاة فرض على كل مسلم بغض النظر عن ثروته.',
    type: 'true_false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q6',
    question: 'Name the angel who brought revelation to the Prophet.',
    questionArabic: 'ما اسم الملك الذي أنزل الوحي على النبي؟',
    type: 'short_answer',
    correctAnswer: 'Jibreel',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q7',
    question: 'How many surahs are in the Quran?',
    questionArabic: 'كم عدد السور في القرآن؟',
    type: 'mcq',
    options: ['100', '110', '114', '120'],
    correctAnswer: '114',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q8',
    question: 'Which city did the Prophet migrate to from Makkah?',
    questionArabic: 'إلى أي مدينة هاجر النبي من مكة؟',
    type: 'short_answer',
    correctAnswer: 'Madinah',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q9',
    question: 'The Kaaba is located in Madinah.',
    questionArabic: 'الكعبة تقع في المدينة.',
    type: 'true_false',
    options: ['True', 'False'],
    correctAnswer: 'False',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q10',
    question: 'What is the night journey of the Prophet called?',
    questionArabic: 'ما اسم رحلة النبي الليلية؟',
    type: 'mcq',
    options: ['Hijra', 'Isra', 'Miraj', 'Isra and Miraj'],
    correctAnswer: 'Isra and Miraj',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q11',
    question: 'How many times a day do Muslims pray?',
    questionArabic: 'كم مرة يصلي المسلمون في اليوم؟',
    type: 'mcq',
    options: ['3', '4', '5', '7'],
    correctAnswer: '5',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q12',
    question: 'What is the shortest surah in the Quran?',
    questionArabic: 'ما هي أقصر سورة في القرآن؟',
    type: 'short_answer',
    correctAnswer: 'Al-Kawthar',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'q13',
    question: 'Explain the significance of the Hijrah in Islamic history and its impact on the Muslim community.',
    questionArabic: 'اشرح أهمية الهجرة في التاريخ الإسلامي وتأثيرها على المجتمع المسلم.',
    type: 'essay',
    correctAnswer: '',
    points: 0,
    maxPoints: 20,
    timeLimit: 180,
    rubric: 'Award full marks for: 1) Explanation of what Hijrah was (5pts), 2) Historical context (5pts), 3) Impact on Muslim community (5pts), 4) Long-term significance (5pts)',
    rubricArabic: 'النقاط الكاملة: ١) شرح ماهية الهجرة (٥ نقاط)، ٢) السياق التاريخي (٥ نقاط)، ٣) الأثر على المجتمع المسلم (٥ نقاط)، ٤) الأهمية طويلة المدى (٥ نقاط)',
  },
  {
    id: 'q14',
    question: 'Discuss the importance of Salah (prayer) in the daily life of a Muslim.',
    questionArabic: 'ناقش أهمية الصلاة في الحياة اليومية للمسلم.',
    type: 'essay',
    correctAnswer: '',
    points: 0,
    maxPoints: 15,
    timeLimit: 120,
    rubric: 'Award marks for: 1) Spiritual benefits (5pts), 2) Discipline and structure (5pts), 3) Community aspect (5pts)',
    rubricArabic: 'النقاط: ١) الفوائد الروحية (٥ نقاط)، ٢) الانضباط والنظام (٥ نقاط)، ٣) الجانب المجتمعي (٥ نقاط)',
  },
];

// Sample representatives for upcoming competition
const upcomingReps: QuizRepresentative[] = [
  // AbuBakr house reps
  { id: 'rep1', name: 'Ahmad Ibrahim', house: 'AbuBakr', loginCode: 'AB-2024-001', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q1', 'q2', 'q3'] },
  { id: 'rep2', name: 'Yusuf Salman', house: 'AbuBakr', loginCode: 'AB-2024-002', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q4', 'q5', 'q6'] },
  { id: 'rep3', name: 'Bilal Osman', house: 'AbuBakr', loginCode: 'AB-2024-003', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q7', 'q8', 'q9'] },
  
  // Umar house reps
  { id: 'rep4', name: 'Khalid Mustafa', house: 'Umar', loginCode: 'UM-2024-001', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q10', 'q11', 'q12'] },
  { id: 'rep5', name: 'Hamza Ali', house: 'Umar', loginCode: 'UM-2024-002', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q1', 'q4', 'q7'] },
  { id: 'rep6', name: 'Zaid Abdullah', house: 'Umar', loginCode: 'UM-2024-003', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q2', 'q5', 'q8'] },
  
  // Uthman house reps
  { id: 'rep7', name: 'Omar Farooq', house: 'Uthman', loginCode: 'UT-2024-001', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q3', 'q6', 'q9'] },
  { id: 'rep8', name: 'Isa Musa', house: 'Uthman', loginCode: 'UT-2024-002', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q10', 'q1', 'q4'] },
  { id: 'rep9', name: 'Dawud Sulaiman', house: 'Uthman', loginCode: 'UT-2024-003', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q11', 'q2', 'q5'] },
  
  // Ali house reps
  { id: 'rep10', name: 'Salman Hasan', house: 'Ali', loginCode: 'AL-2024-001', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q12', 'q3', 'q6'] },
  { id: 'rep11', name: 'Hassan Hussain', house: 'Ali', loginCode: 'AL-2024-002', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q7', 'q10', 'q1'] },
  { id: 'rep12', name: 'Jamal Rashid', house: 'Ali', loginCode: 'AL-2024-003', competitionId: 'comp1', hasCompleted: false, score: 0, assignedQuestions: ['q8', 'q11', 'q2'] },
];

// Sample competitions
export const mockCompetitions: QuizCompetition[] = [
  {
    id: 'comp1',
    title: 'Weekly Quiz - Week 2',
    scheduledDate: '2025-01-12',
    scheduledTime: '10:00',
    status: 'upcoming',
    questions: sampleQuestions,
    representatives: upcomingReps,
    repsPerHouse: 3,
    createdAt: '2025-01-05',
    createdBy: 'admin',
  },
];

// Past competition results
export const mockCompetitionResults: CompetitionResult[] = [
  {
    competitionId: 'comp0',
    houseScores: { AbuBakr: 90, Umar: 80, Uthman: 70, Ali: 85 },
    winningHouse: 'AbuBakr',
    topStudent: { name: 'Ahmad Ibrahim', house: 'AbuBakr', score: 30 },
    completedAt: '2025-01-05',
  },
];

// House leaderboard
export const houseLeaderboard: LeaderboardEntry[] = [
  { house: 'AbuBakr', houseArabic: 'أبو بكر', totalScore: 450, competitionsWon: 5, color: 'bg-emerald-500' },
  { house: 'Umar', houseArabic: 'عمر', totalScore: 420, competitionsWon: 4, color: 'bg-blue-500' },
  { house: 'Ali', houseArabic: 'علي', totalScore: 400, competitionsWon: 4, color: 'bg-rose-500' },
  { house: 'Uthman', houseArabic: 'عثمان', totalScore: 380, competitionsWon: 3, color: 'bg-amber-500' },
];

// Top students leaderboard
export const studentLeaderboard: StudentLeaderEntry[] = [
  { name: 'Ahmad Ibrahim', house: 'AbuBakr', totalScore: 120, competitionsParticipated: 5 },
  { name: 'Khalid Mustafa', house: 'Umar', totalScore: 115, competitionsParticipated: 5 },
  { name: 'Salman Hasan', house: 'Ali', totalScore: 110, competitionsParticipated: 4 },
  { name: 'Omar Farooq', house: 'Uthman', totalScore: 105, competitionsParticipated: 5 },
  { name: 'Hamza Ali', house: 'Umar', totalScore: 100, competitionsParticipated: 4 },
];
