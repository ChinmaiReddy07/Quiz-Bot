import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, Lightbulb } from 'lucide-react';
import { Question, Player, Quiz } from '../types/quiz';

interface QuizPlayerProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswer: (answerIndex: number) => void;
  isHost: boolean;
  onNextQuestion: () => void;
  hasAnswered: boolean;
  players: Player[];
  currentQuestionIndex: number;
  showResults: boolean;
  quiz: Quiz;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  onAnswer,
  isHost,
  onNextQuestion,
  hasAnswered,
  players,
  currentQuestionIndex,
  showResults,
  quiz
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(hasAnswered);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswered(hasAnswered);
    setShowExplanation(false);
  }, [question.id, hasAnswered]);

  useEffect(() => {
    if (showResults && quiz.settings.showCorrectAnswer) {
      setShowExplanation(true);
    }
  }, [showResults, quiz.settings.showCorrectAnswer]);

  const handleAnswerClick = (answerIndex: number) => {
    if (answered || showResults) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    onAnswer(answerIndex);
  };

  const getAnsweredCount = () => {
    return players.filter(player => 
      player.answers.some(answer => answer.questionIndex === currentQuestionIndex)
    ).length;
  };

  const progress = ((questionNumber - 1) / totalQuestions) * 100;
  const answeredPercentage = (getAnsweredCount() / Math.max(players.length, 1)) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 lg:p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.toUpperCase()}
            </span>
            <span className="text-white/60 text-sm">{question.category}</span>
            <span className="text-white/60 text-sm">{question.points} pts</span>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-6">
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
          timeRemaining <= 10 ? 'bg-red-500/30 text-red-300 animate-pulse' : 
          timeRemaining <= 20 ? 'bg-orange-500/30 text-orange-300' :
          'bg-blue-500/20 text-blue-300'
        }`}>
          <Clock className="w-6 h-6" />
          <span className="font-bold text-2xl">{timeRemaining}s</span>
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrectAnswer = showResults && isCorrect && quiz.settings.showCorrectAnswer;
          const showWrongAnswer = showResults && isSelected && !isCorrect && quiz.settings.showCorrectAnswer;

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={answered || showResults || timeRemaining === 0}
              className={`p-6 rounded-xl text-left transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 relative overflow-hidden ${
                showCorrectAnswer
                  ? 'bg-green-500/30 border-2 border-green-400 text-green-100 shadow-lg shadow-green-500/20'
                  : showWrongAnswer
                  ? 'bg-red-500/30 border-2 border-red-400 text-red-100 shadow-lg shadow-red-500/20'
                  : isSelected
                  ? 'bg-blue-500/30 border-2 border-blue-400 text-blue-100 shadow-lg shadow-blue-500/20'
                  : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-lg'
              } ${answered || showResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    showCorrectAnswer ? 'bg-green-500' :
                    showWrongAnswer ? 'bg-red-500' :
                    isSelected ? 'bg-blue-500' : 'bg-white/20'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium text-lg">{option}</span>
                </div>
                <div className="flex items-center gap-2">
                  {showCorrectAnswer && <CheckCircle className="w-6 h-6 text-green-400" />}
                  {showWrongAnswer && <XCircle className="w-6 h-6 text-red-400" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && quiz.settings.showCorrectAnswer && (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-semibold">Explanation</span>
          </div>
          <p className="text-white/90">{question.explanation}</p>
        </div>
      )}

      {/* Answer Status */}
      <div className="text-center mb-6">
        {!showResults && answered && (
          <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            Answer submitted! Waiting for results...
          </div>
        )}
        {!answered && timeRemaining > 0 && (
          <p className="text-white/60">Choose your answer above</p>
        )}
        {timeRemaining === 0 && !answered && (
          <div className="flex items-center justify-center gap-2 text-red-400 font-medium">
            <XCircle className="w-5 h-5" />
            Time's up!
          </div>
        )}
      </div>

      {/* Player Progress */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-white/70">
            Players answered: {getAnsweredCount()}/{players.length}
          </span>
          <span className="text-white/70">
            {Math.round(answeredPercentage)}% complete
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${answeredPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Host Controls */}
      {isHost && showResults && (
        <div className="text-center">
          <button
            onClick={onNextQuestion}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
          >
            {questionNumber < totalQuestions ? (
              <>
                Next Question
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                View Results
                <Trophy className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Waiting for Host */}
      {!isHost && showResults && questionNumber < totalQuestions && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Clock className="w-5 h-5 animate-spin" />
            Waiting for host to continue...
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;