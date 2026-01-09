/**
 * Phaser Game Configuration
 * Central configuration for the Knowledge Quest game engine
 */

export const GAME_CONFIG = {
  // Display settings
  WIDTH: 1200,
  HEIGHT: 500,
  BACKGROUND_COLOR: 0x1a0a2e,
  
  // Physics settings
  GRAVITY: 400,
  PLAYER_SPEED: 400,
  JUMP_VELOCITY: -600,
  BOUNCE: 0.1,
  
  // Game mechanics
  ANSWER_BOX_COUNT: 4,
  ANSWER_BOX_WIDTH: 240,
  ANSWER_BOX_HEIGHT: 80,
  ANSWER_BOX_GAP: 25,
  
  // Player settings
  PLAYER_SIZE: 48,
  PLAYER_START_X: 600,
  PLAYER_START_Y: 350,
  
  // Platform settings
  GROUND_HEIGHT: 40,
  PLATFORM_Y: 80,  // Back at the top
  
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
