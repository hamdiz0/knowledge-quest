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
import StatsBar from './components/ui/StatsBar.jsx';
import QuestionDisplay from './components/ui/QuestionDisplay.jsx';
import LyraMessage from './components/ui/LyraMessage.jsx';

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
  const [lives, setLives] = useState(3);
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
      setLives(prev => prev - 1);
      setStreak(0);
      setWrongAnswers(prev => prev + 1);
      setLyraMessage(LYRA_MESSAGES.wrong[Math.floor(Math.random() * LYRA_MESSAGES.wrong.length)]);
    }

    // Proceed to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1 && lives > (isCorrect ? 0 : 1)) {
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
  }, [showFeedback, timeLeft, questions, currentQuestionIndex, streak, lives]);

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
    setLives(3);
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 flex flex-col">
        {/* Stats bar */}
        <div className="max-w-6xl mx-auto w-full mb-4">
          <StatsBar
            score={score}
            streak={streak}
            lives={lives}
            timeLeft={timeLeft}
          />
        </div>

        {/* Question display */}
        <div className="max-w-6xl mx-auto w-full mb-4">
          <QuestionDisplay
            question={currentQ.question}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            difficulty={currentQ.difficulty}
          />
        </div>

        {/* Phaser game area */}
        <div className="flex-1 max-w-6xl mx-auto w-full mb-4">
          <PhaserGame
            ref={gameRef}
            question={currentQ}
            onAnswerSelect={handleAnswerSelect}
            isPaused={showFeedback}
          />
        </div>

        {/* Controls hint */}
        <div className="max-w-6xl mx-auto w-full text-center mb-4">
          <p className="text-slate-500 text-sm">
            Arrow Keys / WASD to move • Space / Up to jump
          </p>
        </div>

        {/* Lyra message */}
        <div className="max-w-6xl mx-auto w-full">
          <LyraMessage message={lyraMessage} />
        </div>
      </div>
    );
  }

  return null;
};

export default KnowledgeQuest;
