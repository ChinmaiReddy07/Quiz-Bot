import React from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Target } from 'lucide-react';
import { Player, Quiz } from '../types/quiz';

interface ScoreboardProps {
  players: Player[];
  currentPlayer: Player | null;
  quiz: Quiz | null;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayer, quiz }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-orange-500';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getPlayerStats = (player: Player) => {
    const correctAnswers = player.answers.filter(a => a.isCorrect).length;
    const totalAnswers = player.answers.length;
    const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
    const avgTimeToAnswer = totalAnswers > 0 
      ? player.answers.reduce((sum, a) => sum + a.timeToAnswer, 0) / totalAnswers 
      : 0;
    
    return { correctAnswers, totalAnswers, accuracy, avgTimeToAnswer };
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Trophy className="w-7 h-7 text-yellow-400" />
        Live Scoreboard
      </h2>

      {players.length === 0 ? (
        <div className="text-center py-8">
          <div className="p-4 bg-white/5 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white/50" />
          </div>
          <p className="text-white/60">No players yet</p>
          <p className="text-white/40 text-sm mt-2">Share the quiz URL to invite players</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const isCurrentPlayer = currentPlayer?.id === player.id;
            const stats = getPlayerStats(player);

            return (
              <div
                key={player.id}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  isCurrentPlayer
                    ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-2 border-purple-400/50 transform scale-105'
                    : rank === 1
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(rank)} rounded-full flex items-center justify-center relative`}>
                      {getRankIcon(rank)}
                      {rank === 1 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${isCurrentPlayer ? 'text-white' : 'text-white/90'}`}>
                          {player.name}
                        </p>
                        {isCurrentPlayer && (
                          <span className="text-xs bg-purple-500 px-2 py-1 rounded-full text-white">You</span>
                        )}
                        {rank === 1 && players.length > 1 && (
                          <span className="text-xs bg-yellow-500 px-2 py-1 rounded-full text-black font-bold">
                            LEADER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span>{stats.correctAnswers}/{stats.totalAnswers} correct</span>
                        <span>{Math.round(stats.accuracy)}% accuracy</span>
                        {stats.avgTimeToAnswer > 0 && (
                          <span>{Math.round(stats.avgTimeToAnswer)}s avg</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{player.score}</p>
                    <p className="text-white/60 text-sm">points</p>
                  </div>
                </div>

                {/* Performance bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Performance</span>
                    <span>{Math.round(stats.accuracy)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${getRankColor(rank)} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${stats.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recent performance indicator */}
                {player.answers.length > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    {player.answers.slice(-5).map((answer, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          answer.isCorrect ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        title={`Question ${answer.questionIndex + 1}: ${answer.isCorrect ? 'Correct' : 'Wrong'} (${answer.points} pts)`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {players.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Quiz Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-2xl font-bold text-white">
                {Math.round(players.reduce((sum, p) => sum + p.score, 0) / players.length) || 0}
              </p>
              <p className="text-white/60 text-sm">Avg Score</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-2xl font-bold text-white">
                {Math.max(...players.map(p => p.score), 0)}
              </p>
              <p className="text-white/60 text-sm">High Score</p>
            </div>
          </div>
          
          {quiz && (
            <div className="grid grid-cols-2 gap-4 text-center mt-3">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-2xl font-bold text-white">
                  {Math.round(
                    players.reduce((sum, p) => {
                      const correct = p.answers.filter(a => a.isCorrect).length;
                      const total = p.answers.length;
                      return sum + (total > 0 ? (correct / total) * 100 : 0);
                    }, 0) / Math.max(players.length, 1)
                  )}%
                </p>
                <p className="text-white/60 text-sm">Avg Accuracy</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-2xl font-bold text-white">
                  {players.reduce((sum, p) => sum + p.answers.length, 0)}
                </p>
                <p className="text-white/60 text-sm">Total Answers</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Player Highlight */}
      {currentPlayer && players.length > 1 && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Your Position
          </h3>
          <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">
                  Rank #{sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1}
                </p>
                <p className="text-white/70 text-sm">
                  {currentPlayer.score} points
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">
                  {sortedPlayers[0].score - currentPlayer.score > 0 
                    ? `${sortedPlayers[0].score - currentPlayer.score} behind leader`
                    : 'Leading!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;