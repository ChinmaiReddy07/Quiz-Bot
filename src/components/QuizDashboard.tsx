import React, { useState, useEffect } from 'react';
import {
  Plus, Play, Edit3, Trash2, Copy, Users, Clock, BarChart3, Share2
} from 'lucide-react';
import { Quiz, QuizSession } from '../types/quiz';
import { quizStorage } from '../utils/quizStorage';
import DarkModeToggle from './DarkMode'; // Adjust if needed

interface QuizDashboardProps {
  onCreateQuiz: () => void;
  onEditQuiz: (quiz: Quiz) => void;
  onHostQuiz: (quiz: Quiz, session: QuizSession) => void;
}

const QuizDashboard: React.FC<QuizDashboardProps> = ({ onCreateQuiz, onEditQuiz, onHostQuiz }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [sessions, setSessions] = useState<Map<string, QuizSession>>(new Map());

  useEffect(() => {
    quizStorage.loadQuizzes();
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    const allQuizzes = Array.from(quizStorage.getAllQuizzes());
    setQuizzes(allQuizzes);
  };

  const deleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      quizStorage.deleteQuiz(quizId);
      loadQuizzes();
    }
  };

  const hostQuiz = (quiz: Quiz) => {
    const session = quizStorage.createSession(quiz.id);
    setSessions(prev => new Map(prev.set(quiz.id, session)));
    const updatedQuiz = { ...quiz, isActive: true };
    quizStorage.updateQuiz(updatedQuiz);
    loadQuizzes();
    onHostQuiz(quiz, session);
  };

  const copyQuizUrl = (session: QuizSession) => {
    navigator.clipboard.writeText(session.sessionUrl);
    alert('Quiz URL copied to clipboard!');
  };

  const shareQuiz = (quiz: Quiz, session: QuizSession) => {
    const shareData = {
      title: `Join "${quiz.title}" Quiz`,
      text: `Join this exciting quiz: ${quiz.title}\n${quiz.description}`,
      url: session.sessionUrl
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      copyQuizUrl(session);
    }
  };

  return (
    <>
      <DarkModeToggle />
      <div className="dark min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Dashboard</h1>
            <p className="text-white/70 dark:text-white/50 text-lg">Create, manage, and host your quizzes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="p-3 bg-purple-500/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{quizzes.length}</p>
              <p className="text-white/60 text-sm">Total Quizzes</p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="p-3 bg-green-500/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Play className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">{quizzes.filter(q => q.isActive).length}</p>
              <p className="text-white/60 text-sm">Active Sessions</p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="p-3 bg-blue-500/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {quizzes.reduce((sum, q) => sum + q.players.length, 0)}
              </p>
              <p className="text-white/60 text-sm">Total Players</p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="p-3 bg-orange-500/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {quizzes.reduce((sum, q) => sum + q.questions.length, 0)}
              </p>
              <p className="text-white/60 text-sm">Total Questions</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={onCreateQuiz}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
            >
              <Plus className="w-6 h-6" />
              Create New Quiz
            </button>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-6 bg-white/5 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Quizzes Yet</h3>
              <p className="text-white/60 mb-8">Create your first quiz to get started!</p>
              <button
                onClick={onCreateQuiz}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const session = sessions.get(quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{quiz.title}</h3>
                        <p className="text-white/70 text-sm line-clamp-3 mb-3">{quiz.description}</p>
                      </div>
                      {quiz.isActive && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{quiz.questions.length}</p>
                        <p className="text-white/60 text-xs">Questions</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{quiz.players.length}</p>
                        <p className="text-white/60 text-xs">Players</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">
                          {Math.ceil(quiz.questions.length * quiz.settings.timePerQuestion / 60)}
                        </p>
                        <p className="text-white/60 text-xs">Minutes</p>
                      </div>
                    </div>

                    {session && (
                      <div className="mb-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-white/80 text-xs mb-2">Quiz URL:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-white/70 text-xs bg-black/20 px-2 py-1 rounded truncate">
                            {session.sessionUrl}
                          </code>
                          <button
                            onClick={() => copyQuizUrl(session)}
                            className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => shareQuiz(quiz, session)}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="Share Quiz"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => hostQuiz(quiz)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Host Quiz
                      </button>
                      <button
                        onClick={() => onEditQuiz(quiz)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-white/50">
                      Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizDashboard;
