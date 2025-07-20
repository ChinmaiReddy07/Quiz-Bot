import React, { useState } from 'react';
import { Play, Users, Book, Clock, Copy, Share2, Settings, Pause, SkipForward } from 'lucide-react';
import { Player, Quiz, QuizSession } from '../types/quiz';

interface QuizHostProps {
  quiz: Quiz;
  players: Player[];
  onStartQuiz: () => void;
  session: QuizSession | null;
}

const QuizHost: React.FC<QuizHostProps> = ({ quiz, players, onStartQuiz, session }) => {
  const [showSettings, setShowSettings] = useState(false);

  const copyQuizUrl = () => {
    if (session) {
      navigator.clipboard.writeText(session.sessionUrl);
      alert('Quiz URL copied to clipboard!');
    }
  };

  const shareQuiz = () => {
    if (!session) return;

    const shareData = {
      title: `Join "${quiz.title}" Quiz`,
      text: `Join this exciting quiz: ${quiz.title}\n${quiz.description}`,
      url: session.sessionUrl
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      copyQuizUrl();
    }
  };

  return (
    <div className="space-y-6">
      {/* Quiz URL Sharing */}
      {session && (
        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Share2 className="w-6 h-6 text-green-400" />
            Share Quiz with Players
          </h2>
          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <p className="text-white/80 text-sm mb-2">Quiz URL:</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-white bg-black/30 px-3 py-2 rounded text-sm break-all">
                {session.sessionUrl}
              </code>
              <button
                onClick={copyQuizUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={shareQuiz}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Link
            </button>
          </div>
          <p className="text-green-300 text-sm mt-3 text-center">
            Players can join by visiting this URL
          </p>
        </div>
      )}

      {/* Host Control Panel */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <Users className="w-7 h-7 text-blue-400" />
          Host Control Panel
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-white/80 text-sm font-medium">Players</span>
            </div>
            <p className="text-2xl font-bold text-white">{players.length}/{quiz.settings.maxPlayers}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-5 h-5 text-purple-400" />
              <span className="text-white/80 text-sm font-medium">Questions</span>
            </div>
            <p className="text-2xl font-bold text-white">{quiz.questions.length}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-white/80 text-sm font-medium">Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Math.ceil(quiz.questions.length * quiz.settings.timePerQuestion / 60)} min
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <span className="text-white/80 text-sm font-medium">Status</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {quiz.isActive ? 'Live' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Quiz Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={onStartQuiz}
            disabled={players.length === 0 || quiz.isActive}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 disabled:transform-none disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6" />
            {quiz.currentState.isActive ? 'Quiz Running' : 'Start Quiz'}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-colors flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
        
        {players.length === 0 && (
          <div className="text-center py-6 bg-white/5 rounded-lg">
            <Users className="w-12 h-12 text-white/50 mx-auto mb-3" />
            <p className="text-white/60 text-lg font-medium mb-2">Waiting for players to join...</p>
            <p className="text-white/50 text-sm">Share the quiz URL above to invite players</p>
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm font-medium">Quiz URL is ready!</p>
              <p className="text-blue-200 text-xs mt-1">Players can join using the link above</p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Settings */}
      {showSettings && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quiz Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white/80 font-semibold">Gameplay</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Time per question:</span>
                  <span className="text-white">{quiz.settings.timePerQuestion}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Show correct answers:</span>
                  <span className="text-white">{quiz.settings.showCorrectAnswer ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Shuffle questions:</span>
                  <span className="text-white">{quiz.settings.shuffleQuestions ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Shuffle answers:</span>
                  <span className="text-white">{quiz.settings.shuffleAnswers ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-white/80 font-semibold">Access</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Max players:</span>
                  <span className="text-white">{quiz.settings.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Allow rejoining:</span>
                  <span className="text-white">{quiz.settings.allowRejoining ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Show leaderboard:</span>
                  <span className="text-white">{quiz.settings.showLeaderboard ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Players */}
      {players.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Connected Players ({players.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {players.map((player, index) => (
              <div key={player.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{player.name}</p>
                    <p className="text-white/60 text-sm">
                      Joined {new Date(player.joinedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Online</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Preview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quiz Preview</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {quiz.questions.slice(0, 5).map((question, index) => (
            <div key={question.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-medium">
                  Q{index + 1}
                </span>
                <span className="text-white/60 text-sm">{question.category}</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  question.difficulty === 'easy' ? 'bg-green-500 text-white' :
                  question.difficulty === 'medium' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
                }`}>
                  {question.difficulty}
                </span>
                <span className="text-white/60 text-sm">{question.timeLimit}s</span>
                <span className="text-white/60 text-sm">{question.points} pts</span>
              </div>
              <p className="text-white text-sm mb-2">{question.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className={`text-xs p-2 rounded ${
                    optIndex === question.correctAnswer 
                      ? 'bg-green-500/30 text-green-200' 
                      : 'bg-white/10 text-white/70'
                  }`}>
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {quiz.questions.length > 5 && (
            <p className="text-white/60 text-sm text-center py-4">
              And {quiz.questions.length - 5} more questions...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHost;