/**
 * TopicScreen - Topic selection with modern input design
 */
import { useState } from 'react';
import { Book, Beaker, Globe, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

const PRESET_TOPICS = [
  { name: 'History', icon: Book, color: 'from-amber-500 to-orange-600' },
  { name: 'Science', icon: Beaker, color: 'from-emerald-500 to-cyan-600' },
  { name: 'Geography', icon: Globe, color: 'from-blue-500 to-indigo-600' },
  { name: 'Literature', icon: BookOpen, color: 'from-pink-500 to-purple-600' },
];

const TopicScreen = ({ 
  topic, 
  setTopic, 
  questionCount, 
  setQuestionCount, 
  onStart, 
  isLoading 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-purple-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl shadow-lg mb-4">
              <span className="text-3xl">🦉</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Realm</h2>
            <p className="text-slate-400">Which knowledge crystals shall we restore?</p>
          </div>

          {/* Topic input */}
          <div className="space-y-4 mb-6">
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter a topic (e.g., World History, Physics...)"
                className="w-full px-5 py-4 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border-2 border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all text-lg"
              />
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 pointer-events-none transition-opacity ${isFocused ? 'opacity-100' : ''}`} />
            </div>

            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="Number of questions (default: 7)"
              min="1"
              max="20"
              className="w-full px-5 py-4 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border-2 border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
            />
          </div>

          {/* Preset topics */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {PRESET_TOPICS.map((presetTopic) => {
              const TopicIcon = presetTopic.icon;
              return (
                <button
                  key={presetTopic.name}
                  onClick={() => setTopic(presetTopic.name)}
                  className={`group relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 ${
                    topic === presetTopic.name 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${presetTopic.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative flex items-center gap-3">
                    <TopicIcon className={`w-5 h-5 ${topic === presetTopic.name ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    <span className={`font-semibold ${topic === presetTopic.name ? 'text-white' : 'text-slate-300'}`}>
                      {presetTopic.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            disabled={!topic || isLoading}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Questions...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Enter Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicScreen;
