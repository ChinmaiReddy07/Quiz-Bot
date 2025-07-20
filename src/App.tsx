import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import QuizDashboard from './components/QuizDashboard';
import QuizCreator from './components/QuizCreator';
import QuizJoin from './components/QuizJoin';
import QuizHost from './components/QuizHost';
import QuizPlayer from './components/QuizPlayer';
import Scoreboard from './components/Scoreboard';
import Results from './components/Results';
import { Player, Question, Quiz, QuizState, QuizSession } from './types/quiz';
import { quizStorage } from './utils/quizStorage';
import { parseURL, updateURL, clearURL } from './utils/urlParser';
import DarkMode from './components/DarkMode';

type AppState = 'dashboard' | 'creator' | 'join' | 'host' | 'player' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    currentQuestion: 0,
    timeRemaining: 30,
    showResults: false,
    isPaused: false
  });
  const [userType, setUserType] = useState<'host' | 'player' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters on app load
    const urlParams = parseURL();
    if (urlParams.quizId) {
      // Load quizzes first
      quizStorage.loadQuizzes();
      setAppState('join');
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizState.isActive && quizState.timeRemaining > 0 && !quizState.isPaused) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.isActive && quizState.timeRemaining === 0) {
      handleTimeUp();
    }
  }, [quizState.isActive, quizState.timeRemaining, quizState.isPaused]);

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setAppState('creator');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setAppState('creator');
  };

  const handleQuizCreated = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setAppState('dashboard');
    setEditingQuiz(null);
  };

  const handleHostQuiz = (quiz: Quiz, session: QuizSession) => {
    setCurrentQuiz(quiz);
    setCurrentSession(session);
    setUserType('host');
    setPlayers(quiz.players);
    setAppState('host');
    updateURL({ quizId: quiz.id, mode: 'host' });
  };

  const handleJoinAsPlayer = (name: string, quiz: Quiz) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      score: 0,
      answers: [],
      isConnected: true,
      joinedAt: new Date()
    };

    // Update quiz with new player
    const updatedQuiz = {
      ...quiz,
      players: [...quiz.players, newPlayer]
    };
    
    quizStorage.updateQuiz(updatedQuiz);
    setCurrentQuiz(updatedQuiz);
    setCurrentPlayer(newPlayer);
    setPlayers(updatedQuiz.players);
    setUserType('player');
    setAppState('host'); // Show waiting room first
    updateURL({ quizId: quiz.id, mode: 'player' });
  };

  const handleStartQuiz = () => {
    if (!currentQuiz) return;

    const updatedQuiz = {
      ...currentQuiz,
      isActive: true,
      currentState: {
        isActive: true,
        currentQuestion: 0,
        timeRemaining: currentQuiz.settings.timePerQuestion,
        showResults: false,
        isPaused: false
      }
    };

    setCurrentQuiz(updatedQuiz);
    quizStorage.updateQuiz(updatedQuiz);
    setQuizState(updatedQuiz.currentState);
    setCurrentQuestionIndex(0);
    setAppState('player');
  };

  const handleAnswer = (playerId: string, answerIndex: number) => {
    if (!currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeBonus = Math.max(0, quizState.timeRemaining - 10);
    const difficultyMultiplier = currentQuestion.difficulty === 'hard' ? 1.5 : 
                                currentQuestion.difficulty === 'medium' ? 1.2 : 1;
    const points = isCorrect ? Math.round((currentQuestion.points + timeBonus * 2) * difficultyMultiplier) : 0;

    const newAnswer = {
      questionIndex: currentQuestionIndex,
      answerIndex,
      isCorrect,
      points,
      timeToAnswer: currentQuiz.settings.timePerQuestion - quizState.timeRemaining
    };

    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? {
            ...player,
            score: player.score + points,
            answers: [...player.answers, newAnswer]
          }
        : player
    ));

    if (currentPlayer?.id === playerId) {
      setCurrentPlayer(prev => prev ? {
        ...prev,
        score: prev.score + points,
        answers: [...prev.answers, newAnswer]
      } : null);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuizState(prev => ({
        ...prev,
        currentQuestion: nextIndex,
        timeRemaining: currentQuiz.settings.timePerQuestion,
        showResults: false
      }));
    } else {
      handleQuizEnd();
    }
  };

  const handleTimeUp = () => {
    setQuizState(prev => ({ ...prev, showResults: true }));
    setTimeout(() => {
      if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
        handleNextQuestion();
      } else {
        handleQuizEnd();
      }
    }, 3000);
  };

  const handleQuizEnd = () => {
    setAppState('results');
    setQuizState(prev => ({ ...prev, isActive: false }));
    
    if (currentQuiz) {
      const updatedQuiz = {
        ...currentQuiz,
        isActive: false,
        players: players
      };
      quizStorage.updateQuiz(updatedQuiz);
    }
  };

  const handleRestart = () => {
    setAppState('dashboard');
    setCurrentQuiz(null);
    setCurrentSession(null);
    setCurrentPlayer(null);
    setPlayers([]);
    setCurrentQuestionIndex(0);
    setUserType(null);
    setQuizState({
      isActive: false,
      currentQuestion: 0,
      timeRemaining: 30,
      showResults: false,
      isPaused: false
    });
    clearURL();
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Parse URL for quiz joining
  const urlParams = parseURL();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-white/80">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'join' && urlParams.quizId) {
    return (
      <QuizJoin
        quizId={urlParams.quizId}
        onJoinAsPlayer={handleJoinAsPlayer}
        onError={handleError}
      />
    );
  }

  if (appState === 'creator') {
    return (
      <QuizCreator
        onBack={() => setAppState('dashboard')}
        onQuizCreated={handleQuizCreated}
        editingQuiz={editingQuiz}
      />
    );
  }

  if (appState === 'dashboard') {
    return (
      <QuizDashboard
        onCreateQuiz={handleCreateQuiz}
        onEditQuiz={handleEditQuiz}
        onHostQuiz={handleHostQuiz}
      />
    );
  }

  return (
    <>
    <DarkMode /> {/* ✅ Dark mode toggle always available */}
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full mr-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">QuizMaster Pro</h1>
          </div>
          {currentQuiz && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
              <h2 className="text-xl font-semibold text-white">{currentQuiz.title}</h2>
              <p className="text-white/70">{currentQuiz.description}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {appState === 'host' && currentQuiz && (
              <QuizHost
                quiz={currentQuiz}
                players={players}
                onStartQuiz={handleStartQuiz}
                session={currentSession}
              />
            )}
            
            {appState === 'player' && currentQuiz && (
              <QuizPlayer
                question={currentQuiz.questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={currentQuiz.questions.length}
                timeRemaining={quizState.timeRemaining}
                onAnswer={(answerIndex) => currentPlayer && handleAnswer(currentPlayer.id, answerIndex)}
                isHost={userType === 'host'}
                onNextQuestion={handleNextQuestion}
                hasAnswered={currentPlayer?.answers.some(a => a.questionIndex === currentQuestionIndex) || false}
                players={players}
                currentQuestionIndex={currentQuestionIndex}
                showResults={quizState.showResults}
                quiz={currentQuiz}
              />
            )}

            {appState === 'results' && currentQuiz && (
              <Results
                players={players}
                questions={currentQuiz.questions}
                onRestart={handleRestart}
                currentPlayer={currentPlayer}
                quiz={currentQuiz}
              />
            )}
          </div>

          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <Scoreboard 
              players={players} 
              currentPlayer={currentPlayer}
              quiz={currentQuiz}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;