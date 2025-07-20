import React from 'react';
import { Trophy, Medal, Award, RotateCcw, Download, Share2, BarChart3, Clock, Target } from 'lucide-react';
import { Player, Question, Quiz } from '../types/quiz';

interface ResultsProps {
  players: Player[];
  questions: Question[];
  onRestart: () => void;
  currentPlayer: Player | null;
  quiz: Quiz;
}

const Results: React.FC<ResultsProps> = ({ players, questions, onRestart, currentPlayer, quiz }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-300" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return null;
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
    const totalTimeSpent = player.answers.reduce((sum, a) => sum + a.timeToAnswer, 0);
    
    return { correctAnswers, totalAnswers, accuracy, avgTimeToAnswer, totalTimeSpent };
  };

  const shareResults = () => {
    const winnerText = sortedPlayers.length > 0 ? `🏆 Winner: ${sortedPlayers[0].name} (${sortedPlayers[0].score} points)` : '';
    const text = `🎉 "${quiz.title}" Quiz Results!\n\n${winnerText}\n\nFinal Leaderboard:\n${sortedPlayers.slice(0, 5).map((p, i) => `${i + 1}. ${p.name}: ${p.score} points`).join('\n')}\n\nJoin us next time! 🚀`;
    
    if (navigator.share) {
      navigator.share({
        title: `${quiz.title} - Quiz Results`,
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  const downloadResults = () => {
    const csvContent = [
      ['Rank', 'Name', 'Score', 'Correct Answers', 'Total Answers', 'Accuracy %', 'Avg Time (s)'],
      ...sortedPlayers.map((player, index) => {
        const stats = getPlayerStats(player);
        return [
          index + 1,
          player.name,
          player.score,
          stats.correctAnswers,
          stats.totalAnswers,
          Math.round(stats.accuracy),
          Math.round(stats.avgTimeToAnswer)
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.replace(/[^a-z0-9]/gi, '_')}_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      {sortedPlayers.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-8 text-center border border-yellow-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="mb-6">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold text-white mb-2">
                🎉 Congratulations! 🎉
              </h2>
              <h3 className="text-3xl font-semibold text-yellow-400 mb-2">
                {sortedPlayers[0].name}
              </h3>
              <p className="text-white/80 text-xl">
                Champion with {sortedPlayers[0].score} points!
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-white/70">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{getPlayerStats(sortedPlayers[0]).correctAnswers}/{questions.length} correct</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{Math.round(getPlayerStats(sortedPlayers[0]).accuracy)}% accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Podium for Top 3 */}
      {sortedPlayers.length >= 3 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Top 3 Finishers</h2>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg p-4 mb-3 h-24 flex items-center justify-center">
                <Medal className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-white font-bold">{sortedPlayers[1].name}</h3>
              <p className="text-gray-300 text-lg font-semibold">{sortedPlayers[1].score} pts</p>
              <p className="text-white/60 text-sm">2nd Place</p>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">{sortedPlayers[0].name}</h3>
              <p className="text-yellow-400 text-xl font-bold">{sortedPlayers[0].score} pts</p>
              <p className="text-white/80 text-sm">Champion</p>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-4 mb-3 h-20 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white font-bold">{sortedPlayers[2].name}</h3>
              <p className="text-amber-400 text-lg font-semibold">{sortedPlayers[2].score} pts</p>
              <p className="text-white/60 text-sm">3rd Place</p>
            </div>
          </div>
        </div>
      )}

      {/* Final Scoreboard */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Final Results</h2>
        
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const isCurrentPlayer = currentPlayer?.id === player.id;
            const stats = getPlayerStats(player);

            return (
              <div
                key={player.id}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  rank <= 3
                    ? `bg-gradient-to-r ${getRankColor(rank)}/20 border-2 border-current/30`
                    : 'bg-white/5'
                } ${isCurrentPlayer ? 'ring-2 ring-purple-400' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">#{rank}</span>
                      {getRankIcon(rank)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">
                          {player.name}
                        </h3>
                        {isCurrentPlayer && (
                          <span className="text-sm bg-purple-500 px-2 py-1 rounded-full text-white">You</span>
                        )}
                        {rank === 1 && (
                          <span className="text-sm bg-yellow-500 px-2 py-1 rounded-full text-black font-bold">
                            WINNER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span>{stats.correctAnswers}/{stats.totalAnswers} correct</span>
                        <span>{Math.round(stats.accuracy)}% accuracy</span>
                        <span>{Math.round(stats.avgTimeToAnswer)}s avg time</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{player.score}</p>
                    <p className="text-white/60">points</p>
                  </div>
                </div>

                {/* Detailed Performance */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-lg font-bold text-green-400">{stats.correctAnswers}</p>
                    <p className="text-white/60 text-xs">Correct</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-lg font-bold text-red-400">{stats.totalAnswers - stats.correctAnswers}</p>
                    <p className="text-white/60 text-xs">Wrong</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-lg font-bold text-blue-400">{Math.round(stats.accuracy)}%</p>
                    <p className="text-white/60 text-xs">Accuracy</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-lg font-bold text-orange-400">{Math.round(stats.totalTimeSpent)}s</p>
                    <p className="text-white/60 text-xs">Total Time</p>
                  </div>
                </div>

                {/* Answer History */}
                <div className="mt-4">
                  <p className="text-white/70 text-sm mb-2">Answer History:</p>
                  <div className="flex gap-1 flex-wrap">
                    {player.answers.map((answer, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          answer.isCorrect 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                        title={`Q${answer.questionIndex + 1}: ${answer.isCorrect ? 'Correct' : 'Wrong'} (${answer.points} pts, ${answer.timeToAnswer}s)`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Statistics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Quiz Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{questions.length}</p>
            <p className="text-white/60 text-sm">Questions</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{players.length}</p>
            <p className="text-white/60 text-sm">Players</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {Math.round(players.reduce((sum, p) => sum + p.score, 0) / Math.max(players.length, 1)) || 0}
            </p>
            <p className="text-white/60 text-sm">Avg Score</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">
              {Math.round(
                players.reduce((sum, p) => {
                  const stats = getPlayerStats(p);
                  return sum + stats.accuracy;
                }, 0) / Math.max(players.length, 1)
              )}%
            </p>
            <p className="text-white/60 text-sm">Avg Accuracy</p>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Quiz Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Title:</span>
                  <span className="text-white">{quiz.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Questions:</span>
                  <span className="text-white">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Time per Question:</span>
                  <span className="text-white">{quiz.settings.timePerQuestion}s</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Highest Score:</span>
                  <span className="text-white">{Math.max(...players.map(p => p.score), 0)} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Best Accuracy:</span>
                  <span className="text-white">
                    {Math.max(...players.map(p => getPlayerStats(p).accuracy), 0).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Completion Rate:</span>
                  <span className="text-white">
                    {Math.round((players.filter(p => p.answers.length === questions.length).length / Math.max(players.length, 1)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <button
          onClick={shareResults}
          className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
        >
          <Share2 className="w-5 h-5" />
          Share Results
        </button>

        <button
          onClick={downloadResults}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
        >
          <Download className="w-5 h-5" />
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default Results;