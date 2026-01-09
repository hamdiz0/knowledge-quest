/**
 * PhaserGame - React component that bridges React and Phaser
 * Manages the Phaser game instance lifecycle within React
 */
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Phaser from 'phaser';
import QuizScene from './scenes/QuizScene.js';
import { GAME_CONFIG } from './config.js';

const PhaserGame = forwardRef(({ question, onAnswerSelect, isPaused }, ref) => {
  const gameContainerRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    resetPlayer: () => {
      if (sceneRef.current) {
        sceneRef.current.resetPlayer();
      }
    },
    updateQuestion: (newQuestion) => {
      if (sceneRef.current) {
        sceneRef.current.updateQuestion(newQuestion);
      }
    },
    showFeedback: (answerIndex, isCorrect) => {
      if (sceneRef.current) {
        sceneRef.current.showFeedback(answerIndex, isCorrect);
      }
    },
    pauseGame: () => {
      if (gameRef.current) {
        gameRef.current.scene.pause('QuizScene');
      }
    },
    resumeGame: () => {
      if (gameRef.current) {
        gameRef.current.scene.resume('QuizScene');
      }
    },
  }));

  useEffect(() => {
    if (!gameContainerRef.current || gameRef.current) return;

    // Create Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      parent: gameContainerRef.current,
      backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: GAME_CONFIG.GRAVITY },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        pixelArt: false,
        antialias: true,
      },
      scene: QuizScene,
    };

    // Create game instance
    gameRef.current = new Phaser.Game(config);

    // Wait for scene to be ready
    gameRef.current.events.once('ready', () => {
      sceneRef.current = gameRef.current.scene.getScene('QuizScene');
      
      if (sceneRef.current) {
        // Initialize scene with data
        sceneRef.current.scene.restart({
          question: question,
          onAnswerSelect: onAnswerSelect,
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  // Update scene when question changes
  useEffect(() => {
    if (sceneRef.current && question) {
      sceneRef.current.updateQuestion(question);
    }
  }, [question]);

  // Update callback reference
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.onAnswerSelect = onAnswerSelect;
    }
  }, [onAnswerSelect]);

  // Handle pause/resume
  useEffect(() => {
    if (!gameRef.current) return;
    
    if (isPaused) {
      gameRef.current.scene.pause('QuizScene');
    } else {
      gameRef.current.scene.resume('QuizScene');
    }
  }, [isPaused]);

  return (
    <div 
      ref={gameContainerRef}
      className="w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
      style={{ 
        aspectRatio: `${GAME_CONFIG.WIDTH}/${GAME_CONFIG.HEIGHT}`,
        maxHeight: '500px',
      }}
    />
  );
});

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
