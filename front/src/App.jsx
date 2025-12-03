import backendApi from './api/Api.js';
import './App.css'

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Book, Trophy, Zap, Heart, Star, Clock, TrendingUp } from 'lucide-react';

const KnowledgeQuest = () => {
  const [gameState, setGameState] = useState('start');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lyraMessage, setLyraMessage] = useState("Welcome, Seeker! Ready to restore the knowledge crystals?");
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeTaken, setTimeTaken] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [answerHistory, setAnswerHistory] = useState([]);
  
  // Character physics
  const [playerPos, setPlayerPos] = useState({ x: 550, y: 400 });
  const [playerVel, setPlayerVel] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const keysPressed = useRef({});
  const gameAreaRef = useRef(null);
  const gameLoopRef = useRef(null);

  const lyraMessages = {
    correct: [
      "Brilliant! Your mind sparkles! ✨",
      "Knowledge looks good on you! 📚",
      "Even I had to look that one up! 🦉",
      "Your wisdom grows stronger! 💎"
    ],
    wrong: [
      "Every mistake is a lesson! 🌟",
      "Don't worry, even owls miss sometimes! 🦉",
      "Learning is a journey, not a race! 💫",
      "Try again, you've got this! 🌙"
    ],
    streak: [
      "Unstoppable! You're on fire! 🔥",
      "Three in a row! Magnificent! ⚡",
      "You're a true Knowledge Master! 👑"
    ]
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback && gameState === 'playing') {
      handleAnswerSelect(null);
    }
  }, [timeLeft, gameState, showFeedback]);

  // Physics and collision detection
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback) return;

    gameLoopRef.current = setInterval(() => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelY = playerVel.y + 0.5; // gravity

        // Get game area dimensions
        const gameArea = gameAreaRef.current;
        const maxX = gameArea ? gameArea.offsetWidth - 35 : 800;
        const groundY = gameArea ? gameArea.offsetHeight - 80 : 460;

        // Horizontal movement
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['q']) {
          newX = Math.max(0, prev.x - 10);
        }
        if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
          newX = Math.min(maxX, prev.x + 10);
        }

        // Vertical movement (gravity)
        newY = prev.y + newVelY;

        // Ground collision - character stays above ground
        if (newY >= groundY) {
          newY = groundY;
          newVelY = 0;
          setIsJumping(false);
        }

        setPlayerVel({ x: 0, y: newVelY });

        // Check answer collision
        checkAnswerCollision({ x: newX, y: newY }, gameArea);

        return { x: newX, y: newY };
      });
    }, 30);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, showFeedback, playerVel]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;

      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && !isJumping && gameState === 'playing' && !showFeedback) {
        e.preventDefault();
        setPlayerVel(prev => ({ ...prev, y: -22 }));
        setIsJumping(true);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, gameState, showFeedback]);

  const checkAnswerCollision = (pos, gameArea) => {
    if (showFeedback || !gameArea) return;

    // Calculate answer box positions based on game area width - MUST MATCH the rendered boxes
    const width = gameArea.offsetWidth;
    const boxWidth = 300; // w-28 = 112px
    const boxHeight = 135
    const gap = 20; // gap-5 = 20px
    const totalWidth = (boxWidth * 4) + (gap * 3);
    const startX = (width - totalWidth) / 2;

    const answerBoxes = [
      { x: startX, y: 8, width: boxWidth, height: boxHeight, index: 0 },
      { x: startX + boxWidth + gap, y: 8, width: boxWidth, height: boxHeight, index: 1 },
      { x: startX + (boxWidth + gap) * 2, y: 8, width: boxWidth, height: boxHeight, index: 2 },
      { x: startX + (boxWidth + gap) * 3, y: 8, width: boxWidth, height: boxHeight, index: 3 },
    ];

    // Character bounding box (35x35 pixels)
    for (let box of answerBoxes) {
      if (
        pos.x + 35 > box.x &&
        pos.x < box.x + box.width &&
        pos.y < box.y + box.height &&
        pos.y + 35 > box.y
      ) {
        handleAnswerSelect(box.index);
        break;
      }
    }
  };

  const generateQuestions = async (userTopic) => {
    setGameState('loading');
    setLyraMessage(`Searching the library for ${userTopic} ...`);
    try {
      // send the topic to the backend
      console.log(backendApi);
      const response = await backendApi.post( "/questions", { topic: userTopic , questionCount: questionCount });
      const data = response.data;
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
        console.error("Gemini response lacked expected text content:", data);
        throw new Error("API response was missing required text data.");
    }

    // 2. Clean and parse the JSON (as you were before)
    const cleanedText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);
      
      setQuestions(parsed.questions);
      setGameState('playing');
      setPlayerPos({ x: 550, y: 400 });
      setPlayerVel({ x: 0, y: 0 });
      setIsJumping(false);
      setTimeLeft(30);
      setLyraMessage("The crystals await! Jump to select your answer! 🦉");
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestions([
        {
          question: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correctAnswer: 1,
          difficulty: "easy"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Jupiter", "Mars", "Saturn"],
          correctAnswer: 2,
          difficulty: "easy"
        },
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correctAnswer: 2,
          difficulty: "medium"
        },
      ]);
      setGameState('playing');
      setPlayerPos({ x: 550, y: 400 });
      setPlayerVel({ x: 0, y: 0 });
      setIsJumping(false);
      setTimeLeft(30);
      setLyraMessage("Using demo crystals! Jump to select! 🦉");
    }
  };

  const handleAnswerSelect = (index) => {
    if (showFeedback) return;
    
    const questionTime = 30 - timeLeft;
    setTimeTaken([...timeTaken, questionTime]);
    setTotalTime(totalTime + questionTime);
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index !== null && index === questions[currentQuestionIndex].correctAnswer;
    
    setAnswerHistory([...answerHistory, {
      question: questions[currentQuestionIndex].question,
      options: questions[currentQuestionIndex].options,
      userAnswer: index,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: isCorrect,
      difficulty: questions[currentQuestionIndex].difficulty
    }]);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 5);
      const difficultyMultiplier = questions[currentQuestionIndex].difficulty === 'hard' ? 2 : 
                                     questions[currentQuestionIndex].difficulty === 'medium' ? 1.5 : 1;
      const points = Math.floor((100 + (streak * 50) + timeBonus) * difficultyMultiplier);
      
      setScore(score + points);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setCorrectAnswers(correctAnswers + 1);
      
      if (streak >= 2) {
        setLyraMessage(lyraMessages.streak[Math.floor(Math.random() * lyraMessages.streak.length)]);
      } else {
        setLyraMessage(lyraMessages.correct[Math.floor(Math.random() * lyraMessages.correct.length)]);
      }
    } else {
      setLives(lives - 1);
      setStreak(0);
      setWrongAnswers(wrongAnswers + 1);
      setLyraMessage(lyraMessages.wrong[Math.floor(Math.random() * lyraMessages.wrong.length)]);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1 && lives > 0) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(30);
        setPlayerPos({ x: 550, y: 400 });
        setPlayerVel({ x: 0, y: 0 });
        setIsJumping(false);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameState('start');
    setTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setLyraMessage("Welcome back, Seeker!");
    setTimeLeft(30);
    setTimeTaken([]);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setTotalTime(0);
    setDifficulty('easy');
    setAnswerHistory([]);
    setPlayerPos({ x: 550, y: 400 });
    setPlayerVel({ x: 0, y: 0 });
    setIsJumping(false);
  };

  // Start Screen
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20 relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🦉</div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-300" />
            Knowledge Quest
            <Sparkles className="text-yellow-300" />
          </h1>
          <p className="text-purple-200 mb-6 text-lg">The Lost Library</p>
          <p className="text-white/80 mb-8">{lyraMessage}</p>
          <button onClick={() => setGameState('topic')} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transform transition shadow-lg hover:shadow-xl">
            Begin Quest
          </button>
        </div>
      </div>
    );
  }

  // Topic Selection Screen
  if (gameState === 'topic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-5xl mb-4 text-center">🦉</div>
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Choose Your Realm</h2>
          <p className="text-purple-200 mb-6 text-center">Which knowledge crystals shall we restore?</p>
          
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a topic (e.g., World History, Physics...)" className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-yellow-400 focus:outline-none mb-4" />
          <input type="number" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} placeholder="Enter number of questions" className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-yellow-400 focus:outline-none mb-4" />
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['History', 'Science', 'Geography', 'Literature'].map((t) => (
              <button key={t} onClick={() => setTopic(t)} className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition border border-white/30">
                {t}
              </button>
            ))}
          </div>
          
          <button onClick={() => topic && generateQuestions(topic)} disabled={!topic && !questionCount} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-full font-bold text-lg hover:scale-105 transform transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Enter Portal ✨
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🦉</div>
          <div className="text-6xl mb-6 animate-spin">💫</div>
          <p className="text-white text-xl font-semibold">{lyraMessage}</p>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing' && questions.length > 0) {
    const currentQ = questions[currentQuestionIndex];
    const timePercentage = (timeLeft / 30) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex flex-col" style={{ height: '100vh' }}>
        {/* Header Stats */}
        <div className="max-w-6xl mx-auto w-full mb-4 relative z-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center border border-white/20 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-white"><Trophy className="text-yellow-400" /><span className="font-bold text-lg">{score}</span></div>
            <div className="flex items-center gap-2"><span className="text-white font-semibold">Streak: {streak}</span></div>
            <div className="flex items-center gap-2"><Clock className="text-blue-400" /><span className="text-white font-bold text-lg">{timeLeft}s</span></div>
          </div>
          
          {/* Timer Bar */}
          <div className="mt-3 bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
            <div 
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="max-w-6xl mx-auto w-full mb-6 relative z-20">
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 text-center">
            <p className="text-purple-300 mb-3">Crystal {currentQuestionIndex + 1} of {questions.length}</p>
            <h3 className="text-2xl font-bold text-white">{currentQ.question}</h3>
          </div>
        </div>

        {/* Game Area with Character */}
        <div className="flex-1 relative w-full max-w-6xl mx-auto rounded-2xl bg-gradient-to-b from-purple-900/30 to-blue-900/30 border-2 border-white/20 overflow-hidden" ref={gameAreaRef} style={{ height: '500px' }}>
          {/* Answer Boxes - positioned in a row at the top */}
          <div className="absolute  p-2 top-2 left-1/2 transform -translate-x-1/2 flex justify-center gap-4 w-full flex h-1/4">
            {currentQ.options.map((option, idx) => (
              <div 
                key={idx}
                className="p-1 min-w-28 text-lg flex-1 bg-gradient-to-br from-blue-500/50 to-purple-500/50 border-4 border-white/80 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 h-full"
                style={{ pointerEvents: 'none' }}
              >
                <p className="text-white font-bold text-center text-xs leading-tight">{option}</p>
              </div>
            ))}
          </div>

          {/* Character - Fixed positioning */}
          <div 
            className="absolute transition-none" 
            style={{ 
              left: `${playerPos.x}px`, 
              top: `${playerPos.y}px`, 
              width: '35px', 
              height: '35px', 
              zIndex: 30,
              willChange: 'transform'
            }}
          >
            <div className="text-5xl">{isJumping ? '🚀' : '🤖'}</div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center text-white/80 text-sm bg-black/50 px-4 py-0.5 rounded-lg z-10 font-semibold text-xs">
            <p>← → Move with Arrows | SPACE/↑ Jump</p>
          </div>
        </div>

        {/* Lyra Message */}
        <div className="max-w-6xl mx-auto w-full mt-4 relative z-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex items-center gap-3 border border-white/20">
            <div className="text-3xl flex-shrink-0">🦉</div>
            <p className="text-white font-semibold">{lyraMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    const avgTime = timeTaken.length > 0 ? Math.round(timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length) : 0;
    
    let badge = "Bronze Seeker 🥉";
    if (accuracy >= 90) badge = "Diamond Seeker 💎";
    else if (accuracy >= 80) badge = "Gold Seeker 👑";
    else if (accuracy >= 70) badge = "Silver Seeker 🥈";

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full text-center shadow-2xl border border-white/20 my-8">
          <div className="text-7xl mb-4 animate-bounce">🦉</div>
          <h2 className="text-4xl font-bold text-white mb-4">Quest Complete!</h2>
          
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <div className="text-6xl mb-4">💎</div>
            <div className="text-5xl font-bold text-yellow-300 mb-2">{score}</div>
            <p className="text-purple-200">Total Knowledge Points</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl mb-2">✅</div><div className="text-2xl font-bold text-green-400">{correctAnswers}</div><div className="text-sm text-purple-200">Correct</div></div>
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl mb-2">❌</div><div className="text-2xl font-bold text-red-400">{wrongAnswers}</div><div className="text-sm text-purple-200">Wrong</div></div>
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl mb-2">🎯</div><div className="text-2xl font-bold text-yellow-400">{accuracy}%</div><div className="text-sm text-purple-200">Accuracy</div></div>
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl mb-2">⚡</div><div className="text-2xl font-bold text-blue-400">{maxStreak}</div><div className="text-sm text-purple-200">Best Streak</div></div>
          </div>

          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="text-5xl mb-3">{badge}</div>
            <p className="text-white font-semibold text-lg">Achievement Unlocked!</p>
          </div>

          {/* Questions Review Table */}
          <div className="bg-white/10 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Book className="text-purple-400" />
              Question Review
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b-2 border-white/30">
                    <th className="px-3 py-2 text-left text-yellow-300">Question</th>
                    <th className="px-3 py-2 text-left text-blue-300">Your Answer</th>
                    <th className="px-3 py-2 text-left text-green-300">Correct Answer</th>
                    <th className="px-3 py-2 text-center text-purple-300">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {answerHistory.map((item, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-3 py-3 text-left text-white/90 font-semibold">{idx + 1}. {item.question}</td>
                      <td className="px-3 py-3 text-left">
                        <span className={item.isCorrect ? 'text-green-300' : 'text-red-300'}>
                          {item.userAnswer !== null ? item.options[item.userAnswer] : 'No Answer'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-left text-green-400 font-semibold">
                        {item.options[item.correctAnswer]}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {item.isCorrect ? <span className="text-2xl">✅</span> : <span className="text-2xl">❌</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button onClick={resetGame} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-full font-bold text-lg hover:scale-105 transform transition shadow-lg">
            New Quest ✨
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default KnowledgeQuest;
