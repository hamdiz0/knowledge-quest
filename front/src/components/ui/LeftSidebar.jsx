/**
 * LeftSidebar - Progress steps and question navigation
 */
import { Check, ChevronRight } from 'lucide-react';

const LeftSidebar = ({ currentIndex, totalQuestions, answerHistory }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl  overflow-y-auto rounded-2xl p-4 border border-purple-500/20 shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-slate-700/50 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Progress
        </h3>
        <p className="text-2xl font-bold text-white mt-1">
          {currentIndex + 1} <span className="text-slate-500 text-lg">/ {totalQuestions}</span>
        </p>
      </div>

      {/* Steps list - takes all available space */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
        <div className="space-y-2">
          {[...Array(totalQuestions)].map((_, i) => {
            const isCompleted = i < currentIndex;
            const isCurrent = i === currentIndex;
            const historyItem = answerHistory[i];
            const wasCorrect = historyItem?.isCorrect;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  isCurrent 
                    ? 'bg-purple-500/20 border border-purple-500/40' 
                    : isCompleted
                      ? 'bg-slate-800/50'
                      : 'bg-transparent'
                }`}
              >
                {/* Step indicator */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? wasCorrect 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                    : isCurrent
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700/50 text-slate-500'
                }`}>
                  {isCompleted ? (
                    wasCorrect ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">✕</span>
                    )
                  ) : (
                    <span className="text-xs font-semibold">{i + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Question {i + 1}
                  </p>
                  {isCompleted && historyItem && (
                    <p className={`text-xs truncate ${wasCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {wasCorrect ? 'Correct' : 'Incorrect'}
                    </p>
                  )}
                </div>

                {/* Current indicator */}
                {isCurrent && (
                  <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar - always at bottom */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex-shrink-0">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Completion</span>
          <span>{Math.round((currentIndex / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default LeftSidebar;
