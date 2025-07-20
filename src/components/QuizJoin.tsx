import React, { useState, useEffect } from 'react';
import { Users, Clock, BarChart3, AlertCircle, Loader } from 'lucide-react';
import { Quiz } from '../types/quiz';
import { quizStorage } from '../utils/quizStorage';

interface QuizJoinProps {
  quizId: string;
  onJoinAsPlayer: (name: string, quiz: Quiz) => void;
  onError: (message: string) => void;
}

const QuizJoin: React.FC<QuizJoinProps> = ({ quizId, onJoinAsPlayer, onError }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    // Load quizzes and sessions first
    quizStorage.loadQuizzes();
    loadQuiz();
  }, [quizId]);

  const loadQuiz = () => {
    const foundQuiz = quizStorage.getQuiz(quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
    } else {
      onError('Quiz not found or has expired');
    }
    setLoading(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !quiz) return;

    setJoining(true);
    
    // Check if player limit reached
    if (quiz.players.length >= quiz.settings.maxPlayers) {
      onError('Quiz is full. Maximum players reached.');
      setJoining(false);
      return;
    }

    // Check if name is already taken
    if (quiz.players.some(p => p.name.toLowerCase() === playerName.toLowerCase().trim())) {
      onError('This name is already taken. Please choose a different name.');
      setJoining(false);
      return;
    }

    try {
      onJoinAsPlayer(playerName.trim(), quiz);
    } catch (error) {
      onError('Failed to join quiz. Please try again.');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h2>
          <p className="text-white/70">This quiz may have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Quiz Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-3">{quiz.title}</h1>
          <p className="text-white/80 mb-4">{quiz.description}</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-semibold">{quiz.questions.length}</p>
              <p className="text-white/60 text-xs">Questions</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-white font-semibold">{quiz.settings.timePerQuestion}s</p>
              <p className="text-white/60 text-xs">Per Question</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-white font-semibold">{quiz.players.length}/{quiz.settings.maxPlayers}</p>
              <p className="text-white/60 text-xs">Players</p>
            </div>
          </div>

          <div className="text-center text-white/60 text-sm">
            Hosted by {quiz.hostName}
          </div>
        </div>

        {/* Join Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Join Quiz</h2>
          
          {quiz.currentState.isActive ? (
            <div className="text-center py-6">
              <div className="p-4 bg-orange-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quiz in Progress</h3>
              <p className="text-white/70 mb-4">This quiz has already started.</p>
              {quiz.settings.allowRejoining ? (
                <form onSubmit={handleJoin} className="space-y-4">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name to rejoin"
                    required
                    maxLength={20}
                    disabled={joining}
                  />
                  <button
                    type="submit"
                    disabled={!playerName.trim() || joining}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    {joining ? 'Joining...' : 'Join Mid-Game'}
                  </button>
                </form>
              ) : (
                <p className="text-white/60">Rejoining is not allowed for this quiz.</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-white/80 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your display name"
                  required
                  maxLength={20}
                  disabled={joining}
                />
                <p className="text-white/60 text-xs mt-1">
                  This name will be visible to other players
                </p>
              </div>

              <button
                type="submit"
                disabled={!playerName.trim() || joining || quiz.players.length >= quiz.settings.maxPlayers}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              >
                {joining ? 'Joining...' : 
                 quiz.players.length >= quiz.settings.maxPlayers ? 'Quiz Full' : 
                 'Join Quiz'}
              </button>
            </form>
          )}
        </div>

        {/* Connected Players */}
        {quiz.players.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-3">
              Connected Players ({quiz.players.length})
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {quiz.players.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm">{player.name}</span>
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizJoin;