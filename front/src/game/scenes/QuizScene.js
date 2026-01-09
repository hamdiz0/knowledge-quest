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
    
    // Wing state
    this.leftWing = null;
    this.rightWing = null;
    this.leftWingGlow = null;
    this.rightWingGlow = null;
    this.wingsOpen = false;
    this.wingOpenness = 0;
    this.wingsTween = null;
    this.flapTween = null;
    this.wasOnGround = true;
    
    // Fast fall state
    this.isFastFalling = false;
    this.fastFallTween = null;
    
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
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: ANSWER_BOX_WIDTH - 30 },
        lineSpacing: 4,
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
    
    // Create player graphics - scaled for larger size
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const scale = PLAYER_SIZE / 48; // Original design was for 48px
    
    // Draw robot character (scaled)
    // Body
    playerGraphics.fillStyle(0x06b6d4, 1);
    playerGraphics.fillRoundedRect(8 * scale, 16 * scale, 32 * scale, 28 * scale, 6 * scale);
    
    // Head
    playerGraphics.fillStyle(0x7c3aed, 1);
    playerGraphics.fillRoundedRect(10 * scale, 2 * scale, 28 * scale, 18 * scale, 8 * scale);
    
    // Eyes
    playerGraphics.fillStyle(0xffffff, 1);
    playerGraphics.fillCircle(18 * scale, 10 * scale, 5 * scale);
    playerGraphics.fillCircle(30 * scale, 10 * scale, 5 * scale);
    
    // Pupils
    playerGraphics.fillStyle(0x1a0a2e, 1);
    playerGraphics.fillCircle(19 * scale, 10 * scale, 2 * scale);
    playerGraphics.fillCircle(31 * scale, 10 * scale, 2 * scale);
    
    // Antenna
    playerGraphics.lineStyle(2 * scale, 0xf59e0b, 1);
    playerGraphics.beginPath();
    playerGraphics.moveTo(24 * scale, 2 * scale);
    playerGraphics.lineTo(24 * scale, -6 * scale);
    playerGraphics.strokePath();
    playerGraphics.fillStyle(0xf59e0b, 1);
    playerGraphics.fillCircle(24 * scale, -8 * scale, 4 * scale);
    
    // Legs
    playerGraphics.fillStyle(0x4c1d95, 1);
    playerGraphics.fillRoundedRect(12 * scale, 42 * scale, 8 * scale, 10 * scale, 2 * scale);
    playerGraphics.fillRoundedRect(28 * scale, 42 * scale, 8 * scale, 10 * scale, 2 * scale);
    
    // Generate texture from graphics
    playerGraphics.generateTexture('player', PLAYER_SIZE, PLAYER_SIZE + 8 * scale);
    playerGraphics.destroy();
    
    // Create player sprite
    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setBounce(BOUNCE);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(PLAYER_SIZE - 8, PLAYER_SIZE);
    this.player.setOffset(4, 4);
    
    // Create wings
    this.createWings(startX, startY);
    
    // Player glow effect
    this.playerGlow = this.add.circle(startX, startY, 40, COLORS.secondary, 0.15);
    this.playerGlow.setBlendMode(Phaser.BlendModes.ADD);
  }

  /**
   * Create animated wings for the player
   */
  createWings(x, y) {
    // Left wing (will be positioned relative to player)
    this.leftWing = this.add.graphics();
    this.leftWing.setPosition(x, y);
    
    // Right wing
    this.rightWing = this.add.graphics();
    this.rightWing.setPosition(x, y);
    
    // Draw initial closed wings
    this.drawWings(0); // 0 = closed, 1 = fully open
    
    // Wing glow effects
    this.leftWingGlow = this.add.graphics();
    this.leftWingGlow.setPosition(x, y);
    this.leftWingGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.leftWingGlow.setAlpha(0);
    
    this.rightWingGlow = this.add.graphics();
    this.rightWingGlow.setPosition(x, y);
    this.rightWingGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.rightWingGlow.setAlpha(0);
  }

  /**
   * Draw wings at a specific openness level
   * @param {number} openness - 0 (closed) to 1 (fully open)
   */
  drawWings(openness) {
    const wingColor = 0xf59e0b;
    const wingInnerColor = 0xfcd34d;
    const wingOutlineColor = 0xd97706;
    
    // Clear previous drawings
    this.leftWing.clear();
    this.rightWing.clear();
    
    // Wing dimensions based on openness
    const wingWidth = 8 + (openness * 20);  // 8px closed, 28px open
    const wingHeight = 12 + (openness * 8); // 12px closed, 20px open
    const wingAngle = openness * 0.3;       // Slight upward angle when open
    const wingOffsetY = -5 - (openness * 5); // Move up when open
    
    // Left wing
    this.leftWing.fillStyle(wingColor, 0.9);
    this.leftWing.beginPath();
    this.leftWing.moveTo(-8, wingOffsetY);
    this.leftWing.lineTo(-8 - wingWidth, wingOffsetY - (wingHeight * wingAngle));
    this.leftWing.lineTo(-8 - wingWidth * 0.7, wingOffsetY + wingHeight * 0.5);
    this.leftWing.lineTo(-8, wingOffsetY + 8);
    this.leftWing.closePath();
    this.leftWing.fillPath();
    
    // Left wing inner detail
    this.leftWing.fillStyle(wingInnerColor, 0.6);
    this.leftWing.beginPath();
    this.leftWing.moveTo(-10, wingOffsetY + 2);
    this.leftWing.lineTo(-8 - wingWidth * 0.6, wingOffsetY - (wingHeight * wingAngle * 0.5));
    this.leftWing.lineTo(-8 - wingWidth * 0.5, wingOffsetY + wingHeight * 0.3);
    this.leftWing.closePath();
    this.leftWing.fillPath();
    
    // Left wing outline
    this.leftWing.lineStyle(2, wingOutlineColor, 1);
    this.leftWing.beginPath();
    this.leftWing.moveTo(-8, wingOffsetY);
    this.leftWing.lineTo(-8 - wingWidth, wingOffsetY - (wingHeight * wingAngle));
    this.leftWing.lineTo(-8 - wingWidth * 0.7, wingOffsetY + wingHeight * 0.5);
    this.leftWing.lineTo(-8, wingOffsetY + 8);
    this.leftWing.closePath();
    this.leftWing.strokePath();
    
    // Right wing (mirrored)
    this.rightWing.fillStyle(wingColor, 0.9);
    this.rightWing.beginPath();
    this.rightWing.moveTo(8, wingOffsetY);
    this.rightWing.lineTo(8 + wingWidth, wingOffsetY - (wingHeight * wingAngle));
    this.rightWing.lineTo(8 + wingWidth * 0.7, wingOffsetY + wingHeight * 0.5);
    this.rightWing.lineTo(8, wingOffsetY + 8);
    this.rightWing.closePath();
    this.rightWing.fillPath();
    
    // Right wing inner detail
    this.rightWing.fillStyle(wingInnerColor, 0.6);
    this.rightWing.beginPath();
    this.rightWing.moveTo(10, wingOffsetY + 2);
    this.rightWing.lineTo(8 + wingWidth * 0.6, wingOffsetY - (wingHeight * wingAngle * 0.5));
    this.rightWing.lineTo(8 + wingWidth * 0.5, wingOffsetY + wingHeight * 0.3);
    this.rightWing.closePath();
    this.rightWing.fillPath();
    
    // Right wing outline
    this.rightWing.lineStyle(2, wingOutlineColor, 1);
    this.rightWing.beginPath();
    this.rightWing.moveTo(8, wingOffsetY);
    this.rightWing.lineTo(8 + wingWidth, wingOffsetY - (wingHeight * wingAngle));
    this.rightWing.lineTo(8 + wingWidth * 0.7, wingOffsetY + wingHeight * 0.5);
    this.rightWing.lineTo(8, wingOffsetY + 8);
    this.rightWing.closePath();
    this.rightWing.strokePath();
    
    // Update glow if wings are open
    if (this.leftWingGlow && this.rightWingGlow) {
      this.leftWingGlow.clear();
      this.rightWingGlow.clear();
      
      if (openness > 0.5) {
        const glowAlpha = (openness - 0.5) * 0.6;
        
        // Left glow
        this.leftWingGlow.fillStyle(0xfbbf24, glowAlpha);
        this.leftWingGlow.fillCircle(-8 - wingWidth * 0.5, wingOffsetY, 8);
        
        // Right glow
        this.rightWingGlow.fillStyle(0xfbbf24, glowAlpha);
        this.rightWingGlow.fillCircle(8 + wingWidth * 0.5, wingOffsetY, 8);
      }
    }
  }

  /**
   * Animate wings opening
   */
  openWings() {
    if (this.wingsOpen || this.wingsTween) return;
    
    this.wingsOpen = true;
    this.wingOpenness = 0;
    
    this.wingsTween = this.tweens.add({
      targets: this,
      wingOpenness: 1,
      duration: 200,
      ease: 'Back.easeOut',
      onUpdate: () => {
        this.drawWings(this.wingOpenness);
      },
      onComplete: () => {
        this.wingsTween = null;
        // Add subtle flapping animation while in air
        this.startWingFlap();
      }
    });
  }

  /**
   * Animate wings closing
   */
  closeWings() {
    if (!this.wingsOpen) return;
    
    // Stop flapping
    if (this.flapTween) {
      this.flapTween.stop();
      this.flapTween = null;
    }
    
    if (this.wingsTween) {
      this.wingsTween.stop();
    }
    
    this.wingsTween = this.tweens.add({
      targets: this,
      wingOpenness: 0,
      duration: 150,
      ease: 'Power2',
      onUpdate: () => {
        this.drawWings(this.wingOpenness);
      },
      onComplete: () => {
        this.wingsOpen = false;
        this.wingsTween = null;
      }
    });
  }

  /**
   * Subtle wing flapping animation while in air
   */
  startWingFlap() {
    if (!this.wingsOpen) return;
    
    this.flapTween = this.tweens.add({
      targets: this,
      wingOpenness: 0.85,
      duration: 150,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        if (this.wingsOpen) {
          this.drawWings(this.wingOpenness);
        }
      }
    });
  }

  /**
   * Update wing positions to follow player
   */
  updateWingPositions() {
    if (!this.player || !this.leftWing || !this.rightWing) return;
    
    const playerX = this.player.x;
    const playerY = this.player.y;
    
    // Position wings at player's center (offset for body position)
    this.leftWing.setPosition(playerX, playerY);
    this.rightWing.setPosition(playerX, playerY);
    
    // Update glow positions too
    if (this.leftWingGlow) {
      this.leftWingGlow.setPosition(playerX, playerY);
    }
    if (this.rightWingGlow) {
      this.rightWingGlow.setPosition(playerX, playerY);
    }
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
    
    const { PLAYER_SPEED, JUMP_VELOCITY, FAST_FALL_VELOCITY } = GAME_CONFIG;
    
    // Track if player was on ground last frame
    const wasOnGround = this.wasOnGround;
    const isOnGround = this.player.body.touching.down;
    
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
    
    if (jumpPressed && isOnGround) {
      this.player.setVelocityY(JUMP_VELOCITY);
      this.createJumpParticles();
      this.isFastFalling = false;
    }
    
    // Fast fall / Cancel jump (down arrow or S)
    const downPressed = this.cursors.down.isDown || this.wasd.down.isDown;
    
    if (downPressed && !isOnGround && !this.isFastFalling) {
      this.startFastFall();
    }
    
    // Reset fast fall state when landing
    if (isOnGround && this.isFastFalling) {
      this.endFastFall();
    }
    
    // Wing animations based on ground state
    if (wasOnGround && !isOnGround) {
      // Just left the ground - open wings
      this.openWings();
    } else if (!wasOnGround && isOnGround) {
      // Just landed - close wings
      this.closeWings();
    }
    
    // Update ground state for next frame
    this.wasOnGround = isOnGround;
    
    // Update player glow position
    if (this.playerGlow) {
      this.playerGlow.x = this.player.x;
      this.playerGlow.y = this.player.y;
    }
    
    // Update wing positions to follow player
    this.updateWingPositions();
  }

  /**
   * Start fast fall animation and physics
   */
  startFastFall() {
    this.isFastFalling = true;
    
    const { FAST_FALL_VELOCITY } = GAME_CONFIG;
    
    // Immediately set downward velocity
    this.player.setVelocityY(FAST_FALL_VELOCITY);
    
    // Close wings quickly during fast fall
    if (this.wingsOpen) {
      // Stop any existing wing animations
      if (this.flapTween) {
        this.flapTween.stop();
        this.flapTween = null;
      }
      if (this.wingsTween) {
        this.wingsTween.stop();
      }
      
      // Quick wing fold animation
      this.wingsTween = this.tweens.add({
        targets: this,
        wingOpenness: 0.2, // Partially closed, tucked position
        duration: 100,
        ease: 'Power2',
        onUpdate: () => {
          this.drawWings(this.wingOpenness);
        }
      });
    }
    
    // Create dive particles
    this.createFastFallParticles();
    
    // Add a slight squish effect
    this.tweens.add({
      targets: this.player,
      scaleX: 0.9,
      scaleY: 1.15,
      duration: 100,
      ease: 'Power2',
    });
  }

  /**
   * End fast fall state
   */
  endFastFall() {
    this.isFastFalling = false;
    
    // Reset player scale with bounce
    this.tweens.add({
      targets: this.player,
      scaleX: 1,
      scaleY: 1,
      duration: 150,
      ease: 'Back.easeOut',
    });
    
    // Create landing impact particles
    this.createLandingParticles();
  }

  /**
   * Create particles during fast fall
   */
  createFastFallParticles() {
    const x = this.player.x;
    const y = this.player.y - 20;
    
    for (let i = 0; i < 6; i++) {
      const particle = this.add.circle(
        x + Phaser.Math.Between(-10, 10),
        y,
        Phaser.Math.Between(2, 4),
        0x06b6d4,
        0.8
      );
      
      this.tweens.add({
        targets: particle,
        y: y - 40,
        alpha: 0,
        scale: 0,
        duration: 200,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Create particles on landing from fast fall
   */
  createLandingParticles() {
    const x = this.player.x;
    const y = this.player.y + 25;
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 6) + (i / 8) * (Math.PI * 2 / 3); // Spread below
      const speed = Phaser.Math.Between(30, 60);
      
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(3, 5),
        0x7c3aed,
        0.9
      );
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed * 0.5,
        alpha: 0,
        scale: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
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
      this.player.setScale(1, 1); // Reset any scale changes from fast fall
    }
    this.canCollide = true;
    
    // Reset wing state
    this.wasOnGround = true;
    this.isFastFalling = false;
    
    // Stop any wing tweens
    if (this.wingsTween) {
      this.wingsTween.stop();
      this.wingsTween = null;
    }
    if (this.flapTween) {
      this.flapTween.stop();
      this.flapTween = null;
    }
    
    // Close wings immediately
    this.wingsOpen = false;
    this.wingOpenness = 0;
    this.drawWings(0);
    
    // Update wing positions
    this.updateWingPositions();
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
