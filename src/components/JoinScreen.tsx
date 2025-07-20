import React, { useState } from 'react';
import { Trophy, Users, Play, Crown } from 'lucide-react';

interface JoinScreenProps {
  onJoinAsHost: () => void;
  onJoinAsPlayer: (name: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ onJoinAsHost, onJoinAsPlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onJoinAsPlayer(playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">QuizMaster Pro</h1>
          <p className="text-white/70 text-lg">Join the ultimate quiz experience</p>
        </div>

        <div className="space-y-4">
          {!showPlayerForm ? (
            <>
              <button
                onClick={onJoinAsHost}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Crown className="w-6 h-6" />
                Join as Quiz Host
              </button>
              
              <button
                onClick={() => setShowPlayerForm(true)}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Users className="w-6 h-6" />
                Join as Player
              </button>
            </>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Join Quiz</h2>
              <form onSubmit={handlePlayerSubmit} className="space-y-4">
                <div>
                  <label htmlFor="playerName" className="block text-white/80 text-sm font-medium mb-2">
                    Enter your name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your display name"
                    required
                    maxLength={20}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPlayerForm(false)}
                    className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!playerName.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5" />
                    Join Quiz
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Share this URL with others to let them join the quiz!
          </p>
          <div className="mt-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <code className="text-white/80 text-sm">{window.location.href}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;