/**
 * RightSidebar - Stats, controls hints, and tips
 */
import { Trophy, Zap, Clock, Keyboard, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const RightSidebar = ({ score, streak, timeLeft, lyraMessage }) => {
  const timeColor = timeLeft <= 5 ? 'text-rose-400' : timeLeft <= 10 ? 'text-amber-400' : 'text-emerald-400';
  const timeBgColor = timeLeft <= 5 ? 'bg-rose-500/20' : timeLeft <= 10 ? 'bg-amber-500/20' : 'bg-emerald-500/20';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Stats Panel */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Stats
        </h3>
        
        <div className="space-y-4">
          {/* Score */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Score</p>
              <p className="text-xl font-bold text-white">{score.toLocaleString()}</p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Streak</p>
              <p className="text-xl font-bold text-white">{streak}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${timeBgColor}`}>
              <Clock className={`w-5 h-5 ${timeColor} ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Time</p>
              <p className={`text-xl font-bold ${timeColor}`}>{timeLeft}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lyra Tips */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🦉</span>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Lyra Says
          </h3>
        </div>
        <p className="text-white text-sm leading-relaxed">
          {lyraMessage}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 shadow-xl flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Controls
          </h3>
        </div>

        <div className="space-y-3">
          {/* Movement */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Move</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <kbd className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                  <ArrowLeft className="w-3.5 h-3.5" />
                </kbd>
                <kbd className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                  <ArrowRight className="w-3.5 h-3.5" />
                </kbd>
              </div>
              <span className="text-slate-600 text-xs">or</span>
              <div className="flex gap-1">
                <kbd className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                  A
                </kbd>
                <kbd className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                  D
                </kbd>
              </div>
            </div>
          </div>

          {/* Jump */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Jump</p>
            <div className="flex items-center gap-2 flex-wrap">
              <kbd className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                <ArrowUp className="w-3.5 h-3.5" />
              </kbd>
              <span className="text-slate-600 text-xs">or</span>
              <kbd className="h-7 px-2 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                Space
              </kbd>
              <span className="text-slate-600 text-xs">or</span>
              <kbd className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 text-xs font-mono border border-slate-700">
                W
              </kbd>
            </div>
          </div>

          {/* Fast Fall / Cancel Jump */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Fast Fall</p>
            <div className="flex items-center gap-2">
              <kbd className="w-7 h-7 bg-cyan-900/50 rounded-lg flex items-center justify-center text-cyan-300 text-xs font-mono border border-cyan-700/50">
                <ArrowDown className="w-3.5 h-3.5" />
              </kbd>
              <span className="text-slate-600 text-xs">or</span>
              <kbd className="w-7 h-7 bg-cyan-900/50 rounded-lg flex items-center justify-center text-cyan-300 text-xs font-mono border border-cyan-700/50">
                S
              </kbd>
              <span className="text-slate-500 text-xs ml-1">(while airborne)</span>
            </div>
          </div>

          {/* Tip */}
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-purple-400">
              Jump into answer boxes to select! Press down to cancel a jump.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
