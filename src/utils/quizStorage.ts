import { Quiz, QuizSession } from '../types/quiz';

// Simulate a backend storage system
class QuizStorage {
  private quizzes: Map<string, Quiz> = new Map();
  private sessions: Map<string, QuizSession> = new Map();

  // Generate unique quiz ID
  generateQuizId(): string {
    return 'quiz_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate unique session URL
  generateSessionUrl(quizId: string): string {
    const sessionId = Math.random().toString(36).substr(2, 8);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?session=${sessionId}&quiz=${quizId}`;
  }

  // Save quiz
  saveQuiz(quiz: Quiz): void {
    this.quizzes.set(quiz.id, quiz);
    localStorage.setItem('quizzes', JSON.stringify(Array.from(this.quizzes.entries())));
  }

  // Get quiz by ID
  getQuiz(quizId: string): Quiz | null {
    return this.quizzes.get(quizId) || null;
  }

  // Get all quizzes for a host
  getQuizzesByHost(hostId: string): Quiz[] {
    return Array.from(this.quizzes.values()).filter(quiz => quiz.hostId === hostId);
  }

  // Get all quizzes
  getAllQuizzes(): Quiz[] {
    return Array.from(this.quizzes.values());
  }

  // Create quiz session
  createSession(quizId: string): QuizSession {
    const sessionUrl = this.generateSessionUrl(quizId);
    const session: QuizSession = {
      quizId,
      sessionUrl,
      isLive: false
    };
    this.sessions.set(quizId, session);
    localStorage.setItem('sessions', JSON.stringify(Array.from(this.sessions.entries())));
    return session;
  }

  // Get session by quiz ID
  getSession(quizId: string): QuizSession | null {
    return this.sessions.get(quizId) || null;
  }

  // Update quiz
  updateQuiz(quiz: Quiz): void {
    this.quizzes.set(quiz.id, quiz);
    this.saveQuiz(quiz);
  }

  // Load quizzes from localStorage
  loadQuizzes(): void {
    const stored = localStorage.getItem('quizzes');
    if (stored) {
      try {
        const entries = JSON.parse(stored);
        this.quizzes = new Map(entries);
      } catch (error) {
        console.error('Error loading quizzes:', error);
        this.quizzes = new Map();
      }
    }
    
    // Load sessions
    const storedSessions = localStorage.getItem('sessions');
    if (storedSessions) {
      try {
        const sessionEntries = JSON.parse(storedSessions);
        this.sessions = new Map(sessionEntries);
      } catch (error) {
        console.error('Error loading sessions:', error);
        this.sessions = new Map();
      }
    }
  }

  // Delete quiz
  deleteQuiz(quizId: string): void {
    this.quizzes.delete(quizId);
    this.sessions.delete(quizId);
    localStorage.setItem('quizzes', JSON.stringify(Array.from(this.quizzes.entries())));
  }
}

export const quizStorage = new QuizStorage();