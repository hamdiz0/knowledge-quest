/**
 * TopicScreen - Immersive topic selection with magical realm aesthetics
 */
import { useState, useEffect } from 'react';

// Pre-generate orb data outside component to avoid Math.random during render
const generateOrbs = (count) => {
  const orbs = [];
  for (let i = 0; i < count; i++) {
    orbs.push({
      id: i,
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4,
      duration: 8 + Math.random() * 12,
      delay: -Math.random() * 10,
    });
  }
  return orbs;
};

const FLOATING_ORBS = generateOrbs(20);

const PRESET_TOPICS = [
  { 
    name: 'History', 
    icon: '📜',
    description: 'Ancient civilizations & events',
    gradient: 'from-amber-500/20 to-orange-600/20',
    border: 'border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  { 
    name: 'Science', 
    icon: '🔬',
    description: 'Physics, chemistry & biology',
    gradient: 'from-emerald-500/20 to-cyan-600/20',
    border: 'border-emerald-500/30',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  { 
    name: 'Geography', 
    icon: '🌍',
    description: 'Countries, capitals & landmarks',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    border: 'border-blue-500/30',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  { 
    name: 'Literature', 
    icon: '📚',
    description: 'Books, authors & poetry',
    gradient: 'from-pink-500/20 to-purple-600/20',
    border: 'border-pink-500/30',
    glow: 'rgba(236, 72, 153, 0.3)',
  },
  { 
    name: 'Mathematics', 
    icon: '🔢',
    description: 'Numbers, equations & logic',
    gradient: 'from-violet-500/20 to-purple-600/20',
    border: 'border-violet-500/30',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  { 
    name: 'Nature', 
    icon: '🌿',
    description: 'Animals, plants & ecosystems',
    gradient: 'from-green-500/20 to-teal-600/20',
    border: 'border-green-500/30',
    glow: 'rgba(34, 197, 94, 0.3)',
  },
];

const TopicScreen = ({ 
  topic, 
  setTopic, 
  questionCount, 
  setQuestionCount, 
  onStart, 
  isLoading 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCountFocused, setIsCountFocused] = useState(false);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Handle question count with max limit of 20
  const handleQuestionCountChange = (e) => {
    const value = e.target.value;
    
    // Allow empty value
    if (value === '') {
      setQuestionCount('');
      setInputError('');
      return;
    }

    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) {
      return;
    }
    
    if (numValue > 20) {
      setQuestionCount('20');
      setInputError('Maximum 20 questions allowed');
      setTimeout(() => setInputError(''), 2000);
    } else if (numValue < 1) {
      setQuestionCount('1');
    } else {
      setQuestionCount(value);
      setInputError('');
    }
  };

  const selectedTopic = PRESET_TOPICS.find(t => t.name === topic);

  return (
    <div className="min-h-screen bg-[#0a0612] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#1a0a2e] to-[#0f0720]" />
        
        {/* Dynamic glow based on selection */}
        <div 
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: selectedTopic 
              ? `radial-gradient(ellipse 60% 40% at 50% 30%, ${selectedTopic.glow} 0%, transparent 50%)`
              : `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Floating orbs */}
        {FLOATING_ORBS.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              width: `${orb.width}px`,
              height: `${orb.height}px`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              background: `rgba(139, 92, 246, ${orb.opacity})`,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
              animation: `float-orb ${orb.duration}s ease-in-out infinite`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}

        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
        />
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 max-w-2xl w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Glass card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-cyan-500/10 to-violet-600/20 rounded-[2rem] blur-xl" />
          
          <div className="relative bg-[#0f0a1a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden">
            {/* Gradient border */}
            <div 
              className="absolute inset-0 rounded-[2rem]"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), transparent 40%, transparent 60%, rgba(6, 182, 212, 0.4))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            <div className="relative p-8 md:p-10">
              {/* Header */}
              <div 
                className={`text-center mb-8 transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h2 
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{
                    fontFamily: '"Cinzel", "Times New Roman", serif',
                    background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Choose Your Realm
                </h2>
                <p className="text-slate-400 text-sm md:text-base">
                  Which knowledge crystals shall we restore?
                </p>
              </div>

              {/* Topic input */}
              <div 
                className={`space-y-4 mb-6 transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {/* Custom topic input */}
                <div className="relative group">
                  <div 
                    className={`absolute -inset-0.5 rounded-xl transition-all duration-300 ${
                      isFocused 
                        ? 'bg-gradient-to-r from-violet-600/50 to-cyan-600/50 blur-sm' 
                        : 'bg-transparent'
                    }`} 
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Enter any topic you want to learn..."
                      className="w-full px-5 py-4 rounded-xl bg-slate-900/80 text-white placeholder-slate-500 border border-slate-700/50 focus:border-violet-500/50 focus:outline-none transition-all text-lg"
                      style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
                    />
                    {topic && (
                      <button
                        onClick={() => setTopic('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Question count input */}
                <div className="relative">
                  <div 
                    className={`absolute -inset-0.5 rounded-xl transition-all duration-300 ${
                      isCountFocused 
                        ? 'bg-gradient-to-r from-violet-600/50 to-cyan-600/50 blur-sm' 
                        : 'bg-transparent'
                    }`} 
                  />
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={questionCount}
                        onChange={handleQuestionCountChange}
                        onFocus={() => setIsCountFocused(true)}
                        onBlur={() => setIsCountFocused(false)}
                        placeholder="Number of questions (1-20)"
                        min="1"
                        max="20"
                        className="w-full px-5 py-3 rounded-xl bg-slate-900/80 text-white placeholder-slate-500 border border-slate-700/50 focus:border-violet-500/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="text-slate-500 text-sm whitespace-nowrap pr-2">
                      Default: 7
                    </div>
                  </div>
                  {/* Error message */}
                  {inputError && (
                    <p className="absolute -bottom-6 left-0 text-amber-400 text-xs animate-pulse">
                      {inputError}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick select label */}
              <div 
                className={`flex items-center gap-3 mb-4 transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700/50" />
                <span className="text-slate-500 text-sm uppercase tracking-wider">Quick Select</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700/50" />
              </div>

              {/* Preset topics grid */}
              <div 
                className={`grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {PRESET_TOPICS.map((presetTopic, index) => (
                  <button
                    key={presetTopic.name}
                    onClick={() => setTopic(presetTopic.name)}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                      topic === presetTopic.name 
                        ? `bg-gradient-to-br ${presetTopic.gradient} ${presetTopic.border} scale-[1.02]`
                        : 'border-slate-700/50 hover:border-slate-600/50 bg-slate-900/30'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Hover glow */}
                    <div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${presetTopic.gradient}`}
                    />
                    
                    {/* Selection indicator */}
                    {topic === presetTopic.name && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50" />
                      </div>
                    )}

                    <div className="relative flex flex-col items-center text-center">
                      <span 
                        className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: topic === presetTopic.name ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none' }}
                      >
                        {presetTopic.icon}
                      </span>
                      <span className={`font-semibold text-sm ${
                        topic === presetTopic.name ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {presetTopic.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-1 hidden md:block">
                        {presetTopic.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Start button */}
              <div 
                className={`transition-all duration-700 delay-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <button
                  onClick={onStart}
                  disabled={!topic || isLoading}
                  className="group relative w-full py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Button background */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    topic 
                      ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600' 
                      : 'bg-slate-700'
                  }`} />
                  
                  {/* Shimmer effect */}
                  {!isLoading && topic && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  )}

                  {/* Button content */}
                  <span className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        Enter the Portal
                        <svg 
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {/* Hint text */}
                {!topic && (
                  <p className="text-center text-slate-500 text-sm mt-3 animate-pulse">
                    Enter a topic or select one above to begin
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');
        
        @keyframes float-orb {
          0%, 100% { 
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% { 
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes gentle-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Hide number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default TopicScreen;
