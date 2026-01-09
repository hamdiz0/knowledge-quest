/**
 * StatsBar - Game HUD showing score, streak, lives, and timer
 */
import { Trophy, Zap, Heart, Clock } from 'lucide-react';

const StatsBar = ({ score, streak, lives, timeLeft, maxTime = 30 }) => {
  const timePercentage = (timeLeft / maxTime) * 100;
  const timeColor = timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="w-full">
      {/* Main stats bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Score */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Score</p>
              <p className="text-xl font-bold text-white">{score.toLocaleString()}</p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Streak</p>
              <p className="text-xl font-bold text-white">{streak}</p>
            </div>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-all ${
                    i < lives 
                      ? 'text-rose-500 fill-rose-500' 
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${timeLeft <= 5 ? 'bg-rose-500/20' : 'bg-cyan-500/20'}`}>
              <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Time</p>
              <p className={`text-xl font-bold ${timeLeft <= 5 ? 'text-rose-400' : 'text-white'}`}>
                {timeLeft}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer progress bar */}
      <div className="mt-3 bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${timeColor}`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatsBar;
