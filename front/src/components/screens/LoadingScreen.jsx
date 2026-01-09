/**
 * LoadingScreen - Animated loading state with progress feel
 */
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: `spin ${8 + i * 2}s linear infinite`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
              style={{
                transform: `translateX(${80 + i * 40}px)`,
                opacity: 0.6 - i * 0.15,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Mascot with glow */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl animate-pulse" />
          <div className="relative text-8xl animate-bounce">🦉</div>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-cyan-500 rounded-full animate-spin" />
          </div>
        </div>

        {/* Message */}
        <p className="text-xl text-white font-semibold mb-2">{message}</p>
        <p className="text-slate-400 text-sm">Summoning ancient knowledge...</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
