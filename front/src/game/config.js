/**
 * Phaser Game Configuration
 * Central configuration for the Knowledge Quest game engine
 */

export const GAME_CONFIG = {
  // Display settings - base dimensions (will scale dynamically)
  WIDTH: 1200,
  HEIGHT: 700,  // Taller aspect ratio to better fill container
  BACKGROUND_COLOR: 0x1a0a2e,
  
  // Physics settings
  GRAVITY: 600,  // Slightly increased for taller game area
  PLAYER_SPEED: 450,
  JUMP_VELOCITY: -750,  // Increased to reach higher answer boxes
  FAST_FALL_VELOCITY: 900,  // For cancel jump
  BOUNCE: 0.1,
  
  // Game mechanics
  ANSWER_BOX_COUNT: 4,
  ANSWER_BOX_WIDTH: 240,   // Larger boxes for better visibility
  ANSWER_BOX_HEIGHT: 110,  // Taller boxes for better readability
  ANSWER_BOX_GAP: 24,
  
  // Player settings
  PLAYER_SIZE: 64,  // Bigger player
  PLAYER_START_X: 600,
  PLAYER_START_Y: 400,
  
  // Platform settings
  GROUND_HEIGHT: 50,
  PLATFORM_Y: 80,  // Answer boxes closer to top
  
  // Visual settings
  COLORS: {
    primary: 0x7c3aed,      // Purple
    secondary: 0x06b6d4,    // Cyan
    accent: 0xf59e0b,       // Amber
    success: 0x10b981,      // Green
    danger: 0xef4444,       // Red
    ground: 0x2d1b4e,       // Dark purple
    answerBox: 0x4c1d95,    // Deep purple
    answerBoxHover: 0x6d28d9,
    text: 0xffffff,
  }
};
