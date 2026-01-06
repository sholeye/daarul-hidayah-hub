/**
 * Quiz Competition Types
 * 
 * Defines all types related to the inter-house quiz competition system.
 */

// The four houses (Bayt)
export type HouseName = 'AbuBakr' | 'Umar' | 'Uthman' | 'Ali';

export interface House {
  id: string;
  name: HouseName;
  nameArabic: string;
  color: string;           // Tailwind color class
  totalScore: number;      // Cumulative score across all competitions
  competitionsWon: number;
}

// Question types supported
export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export interface QuizQuestion {
  id: string;
  question: string;
  questionArabic?: string;
  type: QuestionType;
  options?: string[];       // For MCQ questions (4 options)
  correctAnswer: string;    // The correct answer text
  points: number;           // Points for this question (default 10)
  timeLimit: number;        // Seconds allowed (default 30)
}

// Representative (Rep) who participates in quiz
export interface QuizRepresentative {
  id: string;
  name: string;
  house: HouseName;
  loginCode: string;        // One-time login code for this competition
  competitionId: string;    // Which competition this rep is for
  hasCompleted: boolean;    // Whether they've taken the quiz
  score: number;            // Their score (sum of correct answers)
  assignedQuestions: string[]; // IDs of questions assigned to this rep
}

// A single competition event
export interface QuizCompetition {
  id: string;
  title: string;
  scheduledDate: string;    // ISO date string
  scheduledTime: string;    // 24hr format "HH:mm"
  status: 'upcoming' | 'live' | 'completed';
  questions: QuizQuestion[];
  representatives: QuizRepresentative[];
  repsPerHouse: number;     // How many reps each house sends (e.g., 3)
  createdAt: string;
  createdBy: string;
}

// Competition result after completion
export interface CompetitionResult {
  competitionId: string;
  houseScores: Record<HouseName, number>;  // Total score per house
  winningHouse: HouseName;
  topStudent: {
    name: string;
    house: HouseName;
    score: number;
  };
  completedAt: string;
}

// Answer submitted by a representative
export interface QuizAnswer {
  questionId: string;
  representativeId: string;
  answer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;        // Seconds taken to answer
  answeredAt: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  house: HouseName;
  houseArabic: string;
  totalScore: number;
  competitionsWon: number;
  color: string;
}

// Student leaderboard entry
export interface StudentLeaderEntry {
  name: string;
  house: HouseName;
  totalScore: number;
  competitionsParticipated: number;
}
