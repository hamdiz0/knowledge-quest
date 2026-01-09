/**
 * QuizScene - Main game scene for the Knowledge Quest platformer
 * Handles player movement, physics, and collision with answer boxes
 */
import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export default class QuizScene extends Phaser.Scene {
  constructor() {
    super({ key: 'QuizScene' });
    
    this.player = null;
    this.cursors = null;
    this.answerBoxes = null;
    this.ground = null;
    this.platforms = null;
    this.canCollide = true;
    this.currentQuestion = null;
    this.particles = null;
    
    // Callbacks to React
    this.onAnswerSelect = null;
  }

  /**
   * Initialize scene with data from React
   */
  init(data) {
    this.currentQuestion = data.question || null;
    this.onAnswerSelect = data.onAnswerSelect || (() => {});
    this.canCollide = true;
  }

  /**
   * Create game objects
   */
  create() {
    const { WIDTH, HEIGHT, COLORS } = GAME_CONFIG;
    
    // Create atmospheric background
    this.createBackground();
    
    // Create floating particles for ambiance
    this.createParticles();
    
    // Create ground platform
    this.createGround();
    
    // Create answer platforms
    this.createAnswerBoxes();
    
    // Create player
    this.createPlayer();
    
    // Setup input
    this.setupInput();
    
    // Setup collisions
    this.setupCollisions();
    
    // Add visual effects
    this.createVisualEffects();
  }

  /**
   * Create gradient background with stars
   */
  createBackground() {
    const { WIDTH, HEIGHT } = GAME_CONFIG;
    
    // Create gradient background using graphics
    const bg = this.add.graphics();
    
    // Draw gradient manually
    const colors = [0x1a0a2e, 0x16213e, 0x1a0a2e];
    const steps = 50;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const y = ratio * HEIGHT;
      const colorIndex = Math.floor(ratio * (colors.length - 1));
      const color = colors[Math.min(colorIndex, colors.length - 1)];
      
      bg.fillStyle(color, 1);
      bg.fillRect(0, y, WIDTH, HEIGHT / steps + 1);
    }
    
    // Add decorative stars
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(0, HEIGHT - 100);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 0.8);
      
      const star = this.add.circle(x, y, size, 0xffffff, alpha);
      
      // Twinkle animation
      this.tweens.add({
        targets: star,
        alpha: { from: alpha, to: alpha * 0.3 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  /**
   * Create floating particle effects
   */
  createParticles() {
    const { WIDTH, HEIGHT } = GAME_CONFIG;
    
    // Create floating orbs
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, WIDTH - 50);
      const y = Phaser.Math.Between(150, HEIGHT - 100);
      const size = Phaser.Math.Between(4, 8);
      
      const orb = this.add.circle(x, y, size, 0x7c3aed, 0.4);
      orb.setBlendMode(Phaser.BlendModes.ADD);
      
      // Float animation
      this.tweens.add({
        targets: orb,
        y: y - Phaser.Math.Between(20, 40),
        x: x + Phaser.Math.Between(-30, 30),
        alpha: { from: 0.4, to: 0.1 },
        scale: { from: 1, to: 0.5 },
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  /**
   * Create ground platform
   */
  createGround() {
    const { WIDTH, HEIGHT, COLORS, GROUND_HEIGHT } = GAME_CONFIG;
    
    // Create static ground group
    this.ground = this.physics.add.staticGroup();
    
    // Draw ground graphic
    const groundGraphic = this.add.graphics();
    
    // Ground base
    groundGraphic.fillStyle(COLORS.ground, 1);
    groundGraphic.fillRoundedRect(0, HEIGHT - GROUND_HEIGHT, WIDTH, GROUND_HEIGHT, 0);
    
    // Ground highlight line
    groundGraphic.lineStyle(3, COLORS.primary, 0.8);
    groundGraphic.beginPath();
    groundGraphic.moveTo(0, HEIGHT - GROUND_HEIGHT);
    groundGraphic.lineTo(WIDTH, HEIGHT - GROUND_HEIGHT);
    groundGraphic.strokePath();
    
    // Glow effect
    groundGraphic.lineStyle(8, COLORS.primary, 0.2);
    groundGraphic.beginPath();
    groundGraphic.moveTo(0, HEIGHT - GROUND_HEIGHT);
    groundGraphic.lineTo(WIDTH, HEIGHT - GROUND_HEIGHT);
    groundGraphic.strokePath();
    
    // Create invisible physics body for ground
    const groundBody = this.add.rectangle(
      WIDTH / 2,
      HEIGHT - GROUND_HEIGHT / 2,
      WIDTH,
      GROUND_HEIGHT,
      0x000000,
      0
    );
    this.physics.add.existing(groundBody, true);
    this.ground.add(groundBody);
  }

  /**
   * Create answer box platforms
   */
  createAnswerBoxes() {
    const { WIDTH, ANSWER_BOX_WIDTH, ANSWER_BOX_HEIGHT, ANSWER_BOX_GAP, COLORS, PLATFORM_Y } = GAME_CONFIG;
    
    this.answerBoxes = this.physics.add.staticGroup();
    
    const options = this.currentQuestion?.options || ['A', 'B', 'C', 'D'];
    const totalWidth = (ANSWER_BOX_WIDTH * 4) + (ANSWER_BOX_GAP * 3);
    const startX = (WIDTH - totalWidth) / 2 + ANSWER_BOX_WIDTH / 2;
    
    options.forEach((option, index) => {
      const x = startX + (ANSWER_BOX_WIDTH + ANSWER_BOX_GAP) * index;
      const y = PLATFORM_Y;
      
      // Create container for the answer box
      const container = this.add.container(x, y);
      
      // Background glow
      const glow = this.add.graphics();
      glow.fillStyle(COLORS.primary, 0.3);
      glow.fillRoundedRect(
        -ANSWER_BOX_WIDTH / 2 - 4,
        -ANSWER_BOX_HEIGHT / 2 - 4,
        ANSWER_BOX_WIDTH + 8,
        ANSWER_BOX_HEIGHT + 8,
        16
      );
      container.add(glow);
      
      // Main box
      const box = this.add.graphics();
      box.fillStyle(COLORS.answerBox, 1);
      box.fillRoundedRect(
        -ANSWER_BOX_WIDTH / 2,
        -ANSWER_BOX_HEIGHT / 2,
        ANSWER_BOX_WIDTH,
        ANSWER_BOX_HEIGHT,
        12
      );
      
      // Border
      box.lineStyle(3, COLORS.secondary, 0.8);
      box.strokeRoundedRect(
        -ANSWER_BOX_WIDTH / 2,
        -ANSWER_BOX_HEIGHT / 2,
        ANSWER_BOX_WIDTH,
        ANSWER_BOX_HEIGHT,
        12
      );
      container.add(box);
      
      // Option text
      const text = this.add.text(0, 0, option, {
        fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: ANSWER_BOX_WIDTH - 20 },
      });
      text.setOrigin(0.5, 0.5);
      container.add(text);
      
      // Create physics body
      const hitbox = this.add.rectangle(x, y, ANSWER_BOX_WIDTH, ANSWER_BOX_HEIGHT, 0x000000, 0);
      this.physics.add.existing(hitbox, true);
      hitbox.answerIndex = index;
      hitbox.container = container;
      this.answerBoxes.add(hitbox);
      
      // Hover animation
      this.tweens.add({
        targets: container,
        y: y - 5,
        duration: 1500 + (index * 200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  /**
   * Create player character
   */
  createPlayer() {
    const { WIDTH, HEIGHT, GROUND_HEIGHT, COLORS, PLAYER_SIZE, BOUNCE } = GAME_CONFIG;
    
    // Calculate player starting position (on the ground)
    const startX = WIDTH / 2;
    const startY = HEIGHT - GROUND_HEIGHT - (PLAYER_SIZE / 2);
    
    // Create player graphics
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Draw robot character
    // Body
    playerGraphics.fillStyle(0x06b6d4, 1);
    playerGraphics.fillRoundedRect(8, 16, 32, 28, 6);
    
    // Head
    playerGraphics.fillStyle(0x7c3aed, 1);
    playerGraphics.fillRoundedRect(10, 2, 28, 18, 8);
    
    // Eyes
    playerGraphics.fillStyle(0xffffff, 1);
    playerGraphics.fillCircle(18, 10, 5);
    playerGraphics.fillCircle(30, 10, 5);
    
    // Pupils
    playerGraphics.fillStyle(0x1a0a2e, 1);
    playerGraphics.fillCircle(19, 10, 2);
    playerGraphics.fillCircle(31, 10, 2);
    
    // Antenna
    playerGraphics.lineStyle(2, 0xf59e0b, 1);
    playerGraphics.beginPath();
    playerGraphics.moveTo(24, 2);
    playerGraphics.lineTo(24, -6);
    playerGraphics.strokePath();
    playerGraphics.fillStyle(0xf59e0b, 1);
    playerGraphics.fillCircle(24, -8, 4);
    
    // Legs
    playerGraphics.fillStyle(0x4c1d95, 1);
    playerGraphics.fillRoundedRect(12, 42, 8, 10, 2);
    playerGraphics.fillRoundedRect(28, 42, 8, 10, 2);
    
    // Generate texture from graphics
    playerGraphics.generateTexture('player', PLAYER_SIZE, PLAYER_SIZE + 8);
    playerGraphics.destroy();
    
    // Create player sprite
    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setBounce(BOUNCE);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(PLAYER_SIZE - 8, PLAYER_SIZE);
    this.player.setOffset(4, 4);
    
    // Player glow effect
    this.playerGlow = this.add.circle(startX, startY, 30, COLORS.secondary, 0.15);
    this.playerGlow.setBlendMode(Phaser.BlendModes.ADD);
  }

  /**
   * Setup keyboard input
   */
  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // WASD keys
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      // AZERTY support
      qLeft: Phaser.Input.Keyboard.KeyCodes.Q,
      zUp: Phaser.Input.Keyboard.KeyCodes.Z,
    });
  }

  /**
   * Setup physics collisions
   */
  setupCollisions() {
    // Player collides with ground
    this.physics.add.collider(this.player, this.ground);
    
    // Player overlaps with answer boxes (triggers callback)
    this.physics.add.overlap(
      this.player,
      this.answerBoxes,
      this.handleAnswerCollision,
      null,
      this
    );
  }

  /**
   * Handle collision with answer box
   */
  handleAnswerCollision(player, answerBox) {
    if (!this.canCollide) return;
    
    this.canCollide = false;
    
    // Visual feedback
    this.flashAnswerBox(answerBox);
    this.createCollisionParticles(player.x, player.y);
    
    // Notify React
    if (this.onAnswerSelect) {
      this.onAnswerSelect(answerBox.answerIndex);
    }
  }

  /**
   * Flash answer box on selection
   */
  flashAnswerBox(answerBox) {
    if (answerBox.container) {
      this.tweens.add({
        targets: answerBox.container,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        yoyo: true,
        ease: 'Back.easeOut',
      });
    }
  }

  /**
   * Create particle burst on collision
   */
  createCollisionParticles(x, y) {
    const colors = [0x7c3aed, 0x06b6d4, 0xf59e0b];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = Phaser.Math.Between(100, 200);
      const color = colors[i % colors.length];
      
      const particle = this.add.circle(x, y, Phaser.Math.Between(3, 6), color, 1);
      particle.setBlendMode(Phaser.BlendModes.ADD);
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Create additional visual effects
   */
  createVisualEffects() {
    // Add subtle vignette effect
    const { WIDTH, HEIGHT } = GAME_CONFIG;
    const vignette = this.add.graphics();
    
    vignette.fillStyle(0x000000, 0.3);
    vignette.fillRect(0, 0, 50, HEIGHT);
    vignette.fillRect(WIDTH - 50, 0, 50, HEIGHT);
  }

  /**
   * Game loop update
   */
  update() {
    if (!this.player || !this.canCollide) return;
    
    const { PLAYER_SPEED, JUMP_VELOCITY } = GAME_CONFIG;
    
    // Horizontal movement
    const leftPressed = this.cursors.left.isDown || this.wasd.left.isDown || this.wasd.qLeft.isDown;
    const rightPressed = this.cursors.right.isDown || this.wasd.right.isDown;
    
    if (leftPressed) {
      this.player.setVelocityX(-PLAYER_SPEED);
      this.player.setFlipX(true);
    } else if (rightPressed) {
      this.player.setVelocityX(PLAYER_SPEED);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }
    
    // Jumping
    const jumpPressed = this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.jump.isDown || this.wasd.zUp.isDown;
    
    if (jumpPressed && this.player.body.touching.down) {
      this.player.setVelocityY(JUMP_VELOCITY);
      this.createJumpParticles();
    }
    
    // Update player glow position
    if (this.playerGlow) {
      this.playerGlow.x = this.player.x;
      this.playerGlow.y = this.player.y;
    }
  }

  /**
   * Create jump particles
   */
  createJumpParticles() {
    const x = this.player.x;
    const y = this.player.y + 20;
    
    for (let i = 0; i < 5; i++) {
      const particle = this.add.circle(
        x + Phaser.Math.Between(-15, 15),
        y,
        Phaser.Math.Between(2, 4),
        0x7c3aed,
        0.8
      );
      
      this.tweens.add({
        targets: particle,
        y: y + 30,
        alpha: 0,
        scale: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Reset player position (called from React)
   */
  resetPlayer() {
    const { WIDTH, HEIGHT, GROUND_HEIGHT, PLAYER_SIZE } = GAME_CONFIG;
    
    // Reset player to center, on top of ground
    const groundY = HEIGHT - GROUND_HEIGHT - (PLAYER_SIZE / 2);
    
    if (this.player) {
      this.player.setPosition(WIDTH / 2, groundY);
      this.player.setVelocity(0, 0);
    }
    this.canCollide = true;
  }

  /**
   * Update question and answer boxes
   */
  updateQuestion(question) {
    this.currentQuestion = question;
    this.canCollide = true;
    
    // Update answer box texts
    const options = question?.options || ['A', 'B', 'C', 'D'];
    
    this.answerBoxes.getChildren().forEach((hitbox, index) => {
      if (hitbox.container) {
        const text = hitbox.container.list.find(child => child.type === 'Text');
        if (text && options[index]) {
          text.setText(options[index]);
        }
      }
    });
    
    this.resetPlayer();
  }

  /**
   * Show feedback for correct/wrong answer
   */
  showFeedback(answerIndex, isCorrect) {
    this.canCollide = false;
    
    const hitbox = this.answerBoxes.getChildren()[answerIndex];
    if (!hitbox || !hitbox.container) return;
    
    const color = isCorrect ? 0x10b981 : 0xef4444;
    
    // Flash effect
    const flash = this.add.rectangle(
      hitbox.x,
      hitbox.y,
      GAME_CONFIG.ANSWER_BOX_WIDTH + 20,
      GAME_CONFIG.ANSWER_BOX_HEIGHT + 20,
      color,
      0.5
    );
    flash.setBlendMode(Phaser.BlendModes.ADD);
    
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.2,
      duration: 500,
      onComplete: () => flash.destroy(),
    });
    
    // Particle burst
    const particleCount = isCorrect ? 20 : 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = Phaser.Math.Between(50, 150);
      
      const particle = this.add.circle(
        hitbox.x,
        hitbox.y,
        Phaser.Math.Between(3, 8),
        color,
        1
      );
      
      this.tweens.add({
        targets: particle,
        x: hitbox.x + Math.cos(angle) * speed,
        y: hitbox.y + Math.sin(angle) * speed,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }
}
