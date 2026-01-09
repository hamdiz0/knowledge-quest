/**
 * StartScreen - Immersive welcome experience with ethereal library aesthetic
 */
import { useEffect, useState } from 'react';

// Pre-generate particle data to avoid Math.random during render
const generateParticles = (count) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      colorType: i % 3,
      duration: 10 + Math.random() * 20,
      delay: -Math.random() * 20,
    });
  }
  return particles;
};

const PARTICLES = generateParticles(40);

const StartScreen = ({ onStart, lyraMessage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [crystalsLoaded, setCrystalsLoaded] = useState(false);

  useEffect(() => {
    // Staggered entrance animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setCrystalsLoaded(true), 600);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0612] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Deep space background with aurora effect */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#1a0a2e] to-[#0f0720]" />
        
        {/* Aurora waves */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 60%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 50% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 40%)
            `,
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: `${p.width}px`,
                height: `${p.height}px`,
                left: `${p.left}%`,
                top: `${p.top}%`,
                background: p.colorType === 0 
                  ? 'rgba(139, 92, 246, 0.6)' 
                  : p.colorType === 1 
                    ? 'rgba(6, 182, 212, 0.5)' 
                    : 'rgba(255, 255, 255, 0.4)',
                boxShadow: p.colorType === 0 
                  ? '0 0 10px rgba(139, 92, 246, 0.8)' 
                  : '0 0 8px rgba(6, 182, 212, 0.6)',
                animation: `drift ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Mystical grid floor perspective */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[40%] opacity-20"
          style={{
            background: `
              linear-gradient(to top, rgba(139, 92, 246, 0.1) 0%, transparent 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                rgba(139, 92, 246, 0.1) 50px,
                rgba(139, 92, 246, 0.1) 51px
              )
            `,
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        />
      </div>

      {/* Main content container */}
      <div 
        className={`relative z-10 max-w-2xl w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Floating crystal shards decoration */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none">
          {crystalsLoaded && [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 30}%`,
                animation: `crystal-float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div 
                className="w-4 h-8 rotate-45"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(139, 92, 246, 0.8) 0%, 
                    rgba(6, 182, 212, 0.6) 50%,
                    rgba(168, 85, 247, 0.4) 100%)`,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Glass morphism card */}
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-violet-600/20 rounded-[2rem] blur-xl" />
          
          {/* Card */}
          <div className="relative bg-[#0f0a1a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden">
            {/* Animated border gradient */}
            <div 
              className="absolute inset-0 rounded-[2rem]"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), transparent 40%, transparent 60%, rgba(6, 182, 212, 0.5))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Inner content */}
            <div className="relative p-8 md:p-12">
              {/* Mascot section */}
              <div 
                className={`flex justify-center mb-8 transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
              >
                <div className="relative group">
                  {/* Glowing rings */}
                  <div className="absolute inset-0 -m-8">
                    <div 
                      className="absolute inset-0 rounded-full border border-violet-500/30"
                      style={{ animation: 'pulse-ring 3s ease-out infinite' }}
                    />
                    <div 
                      className="absolute inset-2 rounded-full border border-cyan-500/20"
                      style={{ animation: 'pulse-ring 3s ease-out infinite 0.5s' }}
                    />
                    <div 
                      className="absolute inset-4 rounded-full border border-violet-500/10"
                      style={{ animation: 'pulse-ring 3s ease-out infinite 1s' }}
                    />
                  </div>
                  
                  {/* Mascot container */}
                  <div 
                    className="relative w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
                      boxShadow: `
                        0 0 40px rgba(139, 92, 246, 0.3),
                        inset 0 0 30px rgba(139, 92, 246, 0.1)
                      `,
                    }}
                  >
                    <span 
                      className="text-6xl filter drop-shadow-lg"
                      style={{ animation: 'gentle-float 4s ease-in-out infinite' }}
                    >
                      🦉
                    </span>
                  </div>

                  {/* Lyra name badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600/80 to-cyan-600/80 rounded-full">
                    <span className="text-xs font-bold text-white tracking-widest uppercase">Lyra</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div 
                className={`text-center mb-6 transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h1 
                  className="text-5xl md:text-6xl font-black tracking-tight mb-3"
                  style={{
                    fontFamily: '"Cinzel", "Times New Roman", serif',
                    background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 30%, #67e8f9 70%, #fff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 60px rgba(139, 92, 246, 0.5)',
                  }}
                >
                  Knowledge Quest
                </h1>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                  <p 
                    className="text-lg tracking-[0.3em] uppercase"
                    style={{
                      fontFamily: '"Cinzel", "Times New Roman", serif',
                      color: 'rgba(196, 181, 253, 0.8)',
                    }}
                  >
                    The Lost Library
                  </p>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                </div>
              </div>

              {/* Lyra message bubble */}
              <div 
                className={`relative mb-8 transition-all duration-700 delay-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="relative bg-gradient-to-br from-violet-900/30 to-slate-900/50 rounded-2xl p-5 border border-violet-500/20">
                  {/* Quote marks */}
                  <span className="absolute -top-2 left-4 text-4xl text-violet-500/30 font-serif">"</span>
                  <p className="text-slate-300 text-center leading-relaxed pl-4 pr-4">
                    {lyraMessage}
                  </p>
                  <span className="absolute -bottom-4 right-4 text-4xl text-violet-500/30 font-serif">"</span>
                </div>
              </div>

              {/* Start button */}
              <div 
                className={`transition-all duration-700 delay-900 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <button
                  onClick={onStart}
                  className="group relative w-full py-5 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Button gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600" />
                  
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 2s infinite',
                    }}
                  />

                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 blur-xl -z-10" />

                  {/* Button content */}
                  <span className="relative flex items-center justify-center gap-3 text-white font-bold text-lg tracking-wide">
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Begin Your Quest
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
        
        @keyframes drift {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes crystal-float {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-10px) rotate(50deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
