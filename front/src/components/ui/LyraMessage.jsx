/**
 * LyraMessage - Owl mascot message bubble
 */
const LyraMessage = ({ message }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 shadow-xl">
      <div className="flex items-center gap-4">
        {/* Mascot avatar */}
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">🦉</span>
        </div>

        {/* Message bubble */}
        <div className="flex-1 relative">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-slate-800" />
          <div className="bg-slate-800/80 rounded-xl px-4 py-2">
            <p className="text-white font-medium text-sm md:text-base">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyraMessage;
