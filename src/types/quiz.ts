export interface Player {
  id: string;
  name: string;
  score: number;
  answers: Answer[];
  isConnected: boolean;
  joinedAt: Date;
  avatar?: string;
}

export interface Answer {
  questionIndex: number;
  answerIndex: number;
  isCorrect: boolean;
  points: number;
  timeToAnswer: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  points: number;
  explanation?: string;
}

export interface QuizState {
  isActive: boolean;
  currentQuestion: number;
  timeRemaining: number;
  showResults: boolean;
  isPaused: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  questions: Question[];
  settings: QuizSettings;
  createdAt: Date;
  isActive: boolean;
  players: Player[];
  currentState: QuizState;
}

export interface QuizSettings {
  timePerQuestion: number;
  showCorrectAnswer: boolean;
  allowRejoining: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  maxPlayers: number;
  requireApproval: boolean;
  showLeaderboard: boolean;
}

export interface QuizSession {
  quizId: string;
  sessionUrl: string;
  isLive: boolean;
  startedAt?: Date;
  endedAt?: Date;
}