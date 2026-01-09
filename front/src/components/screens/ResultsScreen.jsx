/**
 * ResultsScreen - Game completion screen with detailed statistics
 */
import { Target, Zap, RotateCcw, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { useState, useMemo } from 'react';

const BADGES = {
  diamond: { name: 'Diamond Seeker', emoji: '💎', minAccuracy: 90, color: 'from-cyan-400 to-blue-500' },
  gold: { name: 'Gold Seeker', emoji: '👑', minAccuracy: 80, color: 'from-amber-400 to-yellow-500' },
  silver: { name: 'Silver Seeker', emoji: '🥈', minAccuracy: 70, color: 'from-slate-300 to-slate-400' },
  bronze: { name: 'Bronze Seeker', emoji: '🥉', minAccuracy: 0, color: 'from-amber-600 to-orange-700' },
};

// Generate stable random positions for particles
const generateParticlePositions = (count) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      left: (i * 37 + 13) % 100,
      top: (i * 23 + 7) % 100,
      delay: (i * 0.25) % 5,
      duration: 3 + (i % 4),
    });
  }
  return positions;
};

const PARTICLE_POSITIONS = generateParticlePositions(20);

const ResultsScreen = ({
  score,
  correctAnswers,
  wrongAnswers,
  accuracy,
  maxStreak,
  answerHistory,
  onPlayAgain,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Determine badge
  const badge = useMemo(() => {
    return accuracy >= 90 ? BADGES.diamond 
      : accuracy >= 80 ? BADGES.gold 
      : accuracy >= 70 ? BADGES.silver 
      : BADGES.bronze;
  }, [accuracy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        
        {/* Celebration particles */}
        {accuracy >= 70 && PARTICLE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              backgroundColor: ['#7c3aed', '#06b6d4', '#f59e0b'][i % 3],
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl shadow-lg mb-4 animate-bounce">
              <span className="text-5xl">🦉</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-2">Quest Complete!</h2>
            <p className="text-slate-400">Your journey through the Lost Library has ended</p>
          </div>

          {/* Score display */}
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 rounded-2xl p-8 mb-8 border border-purple-500/20 text-center">
            <div className="text-6xl mb-2">{badge.emoji}</div>
            <div className="text-6xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
              {score.toLocaleString()}
            </div>
            <p className="text-slate-400 text-lg">Knowledge Points</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<CheckCircle className="w-6 h-6 text-emerald-400" />}
              value={correctAnswers}
              label="Correct"
              color="emerald"
            />
            <StatCard
              icon={<XCircle className="w-6 h-6 text-rose-400" />}
              value={wrongAnswers}
              label="Wrong"
              color="rose"
            />
            <StatCard
              icon={<Target className="w-6 h-6 text-amber-400" />}
              value={`${accuracy}%`}
              label="Accuracy"
              color="amber"
            />
            <StatCard
              icon={<Zap className="w-6 h-6 text-cyan-400" />}
              value={maxStreak}
              label="Best Streak"
              color="cyan"
            />
          </div>

          {/* Badge earned */}
          <div className={`bg-gradient-to-r ${badge.color} rounded-2xl p-6 mb-8 text-center`}>
            <div className="text-5xl mb-2">{badge.emoji}</div>
            <p className="text-white font-bold text-xl">{badge.name}</p>
            <p className="text-white/80 text-sm">Achievement Unlocked!</p>
          </div>

          {/* Question review toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors mb-4"
          >
            <span className="text-white font-semibold">Question Review</span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Question review table */}
          {showDetails && (
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden mb-8 max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-amber-400 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-amber-400 font-semibold">Question</th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-semibold">Your Answer</th>
                    <th className="px-4 py-3 text-left text-emerald-400 font-semibold">Correct</th>
                    <th className="px-4 py-3 text-center text-purple-400 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {answerHistory.map((item, idx) => (
                    <tr key={idx} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3 text-white font-medium">{item.question}</td>
                      <td className={`px-4 py-3 ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.userAnswer !== null ? item.options[item.userAnswer] : 'No Answer'}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-medium">
                        {item.options[item.correctAnswer]}
                      </td>
                      <td className="px-4 py-3 text-center text-xl">
                        {item.isCorrect ? '✅' : '❌'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Play again button */}
          <button
            onClick={onPlayAgain}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              New Quest
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className={`text-2xl font-bold text-${color}-400`}>{value}</div>
    <div className="text-slate-500 text-sm">{label}</div>
  </div>
);

export default ResultsScreen;
