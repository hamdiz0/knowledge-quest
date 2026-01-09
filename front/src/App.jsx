/**
 * Knowledge Quest - Main Application
 * A gamified learning platform with Phaser-powered platformer mechanics
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import backendApi from './api/Api.js';

// Screens
import StartScreen from './components/screens/StartScreen.jsx';
import TopicScreen from './components/screens/TopicScreen.jsx';
import LoadingScreen from './components/screens/LoadingScreen.jsx';
import ResultsScreen from './components/screens/ResultsScreen.jsx';

// UI Components
import LeftSidebar from './components/ui/LeftSidebar.jsx';
import RightSidebar from './components/ui/RightSidebar.jsx';

// Game
import PhaserGame from './game/PhaserGame.jsx';

import './App.css';

// Lyra (owl mascot) messages
const LYRA_MESSAGES = {
  welcome: "Welcome, Seeker! Ready to restore the knowledge crystals?",
  correct: [
    "Brilliant! Your mind sparkles!",
    "Knowledge looks good on you!",
    "Even I had to look that one up!",
    "Your wisdom grows stronger!",
  ],
  wrong: [
    "Every mistake is a lesson!",
    "Don't worry, even owls miss sometimes!",
    "Learning is a journey, not a race!",
    "Try again, you've got this!",
  ],
  streak: [
    "Unstoppable! You're on fire!",
    "Three in a row! Magnificent!",
    "You're a true Knowledge Master!",
  ],
  loading: (topic) => `Searching the library for ${topic}...`,
  playing: "Jump to select your answer!",
};

const KnowledgeQuest = () => {
  // Game state
  const [gameState, setGameState] = useState('start');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Score & stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);
  
  // UI state
  const [lyraMessage, setLyraMessage] = useState(LYRA_MESSAGES.welcome);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Refs
  const gameRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback && gameState === 'playing') {
      handleAnswerSelect(null);
    }
  }, [timeLeft, gameState, showFeedback]);

  // Generate questions from API
  const generateQuestions = async (userTopic) => {
    setGameState('loading');
    setLyraMessage(LYRA_MESSAGES.loading(userTopic));
    
    try {
      const response = await backendApi.post('/questions', {
        topic: userTopic,
        questionCount: questionCount || 7,
      });
      
      const data = response.data;
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error('API response was missing required text data.');
      }
      
      const cleanedText = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      setQuestions(parsed.questions);
      setGameState('playing');
      setTimeLeft(30);
      setLyraMessage(LYRA_MESSAGES.playing);
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback demo questions
      setQuestions([
        {
          question: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1,
          difficulty: 'easy',
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
          correctAnswer: 2,
          difficulty: 'easy',
        },
        {
          question: 'What is the chemical symbol for gold?',
          options: ['Go', 'Gd', 'Au', 'Ag'],
          correctAnswer: 2,
          difficulty: 'medium',
        },
      ]);
      
      setGameState('playing');
      setTimeLeft(30);
      setLyraMessage('Using demo crystals! Jump to select!');
    }
  };

  // Handle answer selection (from Phaser collision)
  const handleAnswerSelect = useCallback((index) => {
    if (showFeedback) return;
    
    const questionTime = 30 - timeLeft;
    setTotalTime(prev => prev + questionTime);
    setShowFeedback(true);
    
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = index !== null && index === currentQ.correctAnswer;
    
    // Record answer history
    setAnswerHistory(prev => [...prev, {
      question: currentQ.question,
      options: currentQ.options,
      userAnswer: index,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      difficulty: currentQ.difficulty,
    }]);
    
    // Show feedback in Phaser
    if (gameRef.current) {
      gameRef.current.showFeedback(index, isCorrect);
    }
    
    if (isCorrect) {
      // Calculate score with bonuses
      const timeBonus = Math.floor(timeLeft * 5);
      const difficultyMultiplier = 
        currentQ.difficulty === 'hard' ? 2 : 
        currentQ.difficulty === 'medium' ? 1.5 : 1;
      const points = Math.floor((100 + (streak * 50) + timeBonus) * difficultyMultiplier);
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrectAnswers(prev => prev + 1);
      
      // Update Lyra message
      if (streak >= 2) {
        setLyraMessage(LYRA_MESSAGES.streak[Math.floor(Math.random() * LYRA_MESSAGES.streak.length)]);
      } else {
        setLyraMessage(LYRA_MESSAGES.correct[Math.floor(Math.random() * LYRA_MESSAGES.correct.length)]);
      }
    } else {
      setStreak(0);
      setWrongAnswers(prev => prev + 1);
      setLyraMessage(LYRA_MESSAGES.wrong[Math.floor(Math.random() * LYRA_MESSAGES.wrong.length)]);
    }

    // Proceed to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowFeedback(false);
        setTimeLeft(30);
        
        // Reset player position in Phaser
        if (gameRef.current) {
          gameRef.current.resetPlayer();
        }
      } else {
        setGameState('results');
      }
    }, 2000);
  }, [showFeedback, timeLeft, questions, currentQuestionIndex, streak]);

  // Reset game
  const resetGame = () => {
    setGameState('start');
    setTopic('');
    setQuestionCount('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setShowFeedback(false);
    setLyraMessage(LYRA_MESSAGES.welcome);
    setTimeLeft(30);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setTotalTime(0);
    setAnswerHistory([]);
  };

  // Render based on game state
  if (gameState === 'start') {
    return (
      <StartScreen
        onStart={() => setGameState('topic')}
        lyraMessage={lyraMessage}
      />
    );
  }

  if (gameState === 'topic') {
    return (
      <TopicScreen
        topic={topic}
        setTopic={setTopic}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        onStart={() => topic && generateQuestions(topic)}
        isLoading={false}
      />
    );
  }

  if (gameState === 'loading') {
    return <LoadingScreen message={lyraMessage} />;
  }

  if (gameState === 'results') {
    const accuracy = questions.length > 0 
      ? Math.round((correctAnswers / questions.length) * 100) 
      : 0;

    return (
      <ResultsScreen
        score={score}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        accuracy={accuracy}
        maxStreak={maxStreak}
        totalTime={totalTime}
        answerHistory={answerHistory}
        onPlayAgain={resetGame}
      />
    );
  }

  // Playing state
  if (gameState === 'playing' && questions.length > 0) {
    const currentQ = questions[currentQuestionIndex];
    const timePercentage = (timeLeft / 30) * 100;
    const timeColor = timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
        <div className="h-[calc(100vh-2rem)] max-w-[1600px] mx-auto grid grid-cols-[240px_1fr_280px] gap-4">
          {/* Left Sidebar - Progress */}
          <LeftSidebar
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            answerHistory={answerHistory}
          />

          {/* Center - Main Game Area */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Question display - fits content with generous max-width */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs">Question {currentQuestionIndex + 1}</span>
                {currentQ.difficulty && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                    currentQ.difficulty === 'hard' 
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : currentQ.difficulty === 'medium'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                )}
              </div>
              <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Phaser game area - takes remaining space */}
            <div className="flex-1 min-h-0">
              <PhaserGame
                ref={gameRef}
                question={currentQ}
                onAnswerSelect={handleAnswerSelect}
                isPaused={showFeedback}
              />
            </div>

            {/* Timer bar - compact */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-2.5 border border-purple-500/20 shadow-xl">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold min-w-[28px] ${timeLeft <= 5 ? 'text-rose-400' : 'text-slate-400'}`}>
                  {timeLeft}s
                </span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${timeColor}`}
                    style={{ width: `${timePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stats & Controls */}
          <RightSidebar
            score={score}
            streak={streak}
            timeLeft={timeLeft}
            lyraMessage={lyraMessage}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default KnowledgeQuest;
