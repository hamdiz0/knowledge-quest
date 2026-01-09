/**
 * StartScreen - Welcome/landing screen with modern design
 */
import { Sparkles } from 'lucide-react';

const StartScreen = ({ onStart, lyraMessage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Main card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-purple-500/20 relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/50 via-transparent to-cyan-500/50 -z-10" />
          
          {/* Mascot */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl shadow-lg shadow-purple-500/25 mb-4 transform hover:scale-105 transition-transform">
              <span className="text-5xl">🦉</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-center mb-2 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent tracking-tight">
            Knowledge Quest
          </h1>
          
          <p className="text-center text-purple-300/80 text-lg mb-6 font-medium tracking-wide">
            The Lost Library
          </p>

          {/* Lyra message */}
          <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 border border-slate-700/50">
            <p className="text-slate-300 text-center text-sm leading-relaxed">
              {lyraMessage}
            </p>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Begin Quest
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Controls hint */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Use arrow keys or WASD to move • Space to jump
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
