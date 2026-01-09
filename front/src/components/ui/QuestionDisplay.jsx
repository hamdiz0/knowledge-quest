/**
 * QuestionDisplay - Shows current question with progress indicator
 */
const QuestionDisplay = ({ question, currentIndex, totalQuestions, difficulty }) => {
  const difficultyColors = {
    easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-sm">Crystal</span>
          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Difficulty badge */}
        {difficulty && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${difficultyColors[difficulty] || difficultyColors.easy}`}>
            {difficulty}
          </span>
        )}
      </div>

      {/* Question text */}
      <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
        {question}
      </h3>

      {/* Progress bar */}
      <div className="mt-4 flex gap-1">
        {[...Array(totalQuestions)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < currentIndex 
                ? 'bg-emerald-500' 
                : i === currentIndex 
                  ? 'bg-purple-500' 
                  : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;
