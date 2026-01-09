/**
 * LoadingScreen - Clean, elegant loading state with magical portal aesthetic
 */
import { useEffect, useState } from 'react';

// Pre-generate particle data outside component to avoid Math.random during render
const generateParticles = (count) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      size: 2 + (i % 5),
      left: 30 + (i * 1.3) % 40,
      top: 30 + (i * 1.7) % 40,
      colorType: i % 2,
      duration: 5 + (i % 6),
      delay: -(i * 0.17),
      originX: 50 - (i % 10) * 5,
      originY: 50 - (i % 8) * 6,
    });
  }
  return particles;
};

const PARTICLES = generateParticles(30);

const LoadingScreen = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0612] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background with portal effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#1a0a2e] to-[#0f0720]" />
        
        {/* Central portal glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)',
            animation: 'portal-pulse 3s ease-in-out infinite',
          }}
        />
        
        {/* Secondary glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 60%)',
            animation: 'portal-pulse 3s ease-in-out infinite 0.5s',
          }}
        />

        {/* Floating energy particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.colorType === 0 
                ? 'rgba(139, 92, 246, 0.8)' 
                : 'rgba(6, 182, 212, 0.7)',
              boxShadow: p.colorType === 0 
                ? '0 0 15px rgba(139, 92, 246, 0.8)' 
                : '0 0 12px rgba(6, 182, 212, 0.6)',
              animation: `particle-orbit ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              transformOrigin: `${p.originX}px ${p.originY}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 flex flex-col items-center text-center max-w-lg w-full transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Loading spinner with owl inside */}
        <div className="relative mb-10">
          {/* Outer glow rings (waves) */}
          <div className="absolute -inset-8">
            <div 
              className="absolute inset-0 rounded-full border-2 border-violet-500/20"
              style={{ animation: 'ring-expand 2s ease-out infinite' }}
            />
            <div 
              className="absolute inset-4 rounded-full border border-cyan-500/20"
              style={{ animation: 'ring-expand 2s ease-out infinite 0.3s' }}
            />
            <div 
              className="absolute inset-8 rounded-full border border-violet-500/10"
              style={{ animation: 'ring-expand 2s ease-out infinite 0.6s' }}
            />
          </div>
          
          {/* Track ring */}
          <div className="w-32 h-32 rounded-full border-2 border-slate-800" />
          
          {/* Spinning arc */}
          <svg 
            className="absolute inset-0 w-32 h-32"
            style={{ animation: 'spin 1.8s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}
          >
            <defs>
              <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="url(#loader-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="120 260"
            />
          </svg>

          {/* Owl icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-5xl"
              style={{ 
                animation: 'owl-focus 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))',
              }}
            >
              🦉
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 
          className="text-2xl md:text-3xl font-bold mb-4 px-4"
          style={{
            fontFamily: '"Cinzel", "Times New Roman", serif',
            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {message || 'Loading...'}
        </h2>
        
        {/* Subtitle */}
        <p className="text-slate-400">
          Summoning ancient knowledge from the archives...
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        
        @keyframes portal-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.7;
          }
        }
        
        @keyframes particle-orbit {
          0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        
        @keyframes ring-expand {
          0% { 
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% { 
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        @keyframes owl-focus {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
