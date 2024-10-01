import { JumpingEnemy, PatrollingEnemy } from "../entities/advancedEnemy";
import { Collectible } from "../entities/collectible";
import { Enemy } from "../entities/enemy";
import { Hazard } from "../entities/hazard";
import { ParallaxBackground } from "../entities/parallaxBackground";
import { Platform } from "../entities/platform";
import { Player } from "../entities/player";
import { InputHandler } from "./inputHandler";

export class GameLoop {
    player: Player;
    inputHandler: InputHandler;
    platforms: Platform[] = [];
    enemies: Enemy[] = [];
    collectibles: Collectible[] = [];
    hazards: Hazard[] = [];
    parallaxBackground: ParallaxBackground;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    currentLevel: number;
    score: number;
    gameOver: boolean;
    gameCompleted: boolean;
    offset: number;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.player = new Player(50, canvas.height - 100, 50, 50, 5, canvas.width, canvas.height);
        this.inputHandler = new InputHandler();
        this.currentLevel = 1;
        this.score = 0;
        this.gameOver = false;
        this.gameCompleted = false;
        this.offset = 200;
        this.loadLevel(this.currentLevel);

        // Initialize parallax background
        this.parallaxBackground = new ParallaxBackground(
          ["/assets/backgrounds/cloud.png"],
          [0.2], // Speed for each layer (the first layer moves slower than the others)
          [0] // Y offset for each layer
        );
    }

    loadLevel(level: number) {
        if (level === 1) {
          this.platforms = [
            new Platform(100, 400, 200, 20),
            new Platform(400, 300, 150, 20),
            new Platform(650, 450, 150, 20),
          ];
          this.enemies = [
            new Enemy(300, 400, 50, 50, 2),
            new Enemy(500, 300, 50, 50, 3),
          ];
          this.collectibles = [
            new Collectible(150, 370, 20, 20),
            new Collectible(450, 270, 20, 20),
            new Collectible(700, 420, 20, 20),
          ];
        } else if (level === 2) {
          this.platforms = [
            new Platform(50, 350, 150, 20),
            new Platform(300, 250, 150, 20),
            new Platform(600, 150, 200, 20),
          ];
          this.enemies = [
            new PatrollingEnemy(300, 400, 50, 50, 2, 100), // Moves back and forth over 100px range
            new JumpingEnemy(500, 300, 50, 50, 2, 120),    // Jumps every 120 frames
          ];
          this.collectibles = [
            new Collectible(100, 320, 20, 20),
            new Collectible(350, 220, 20, 20),
            new Collectible(650, 120, 20, 20),
          ];
          this.hazards = [
            new Hazard(600, 480, 50, 20), // A spike on the ground level
          ];
        }
    }
      

    restartGame() {
        this.currentLevel = 1;
        this.score = 0;
        this.gameOver = false;
        this.gameCompleted = false; // Ensure gameCompleted is also reset
        this.player.health = 3;
        this.player.x = 50;
        this.player.y = this.canvas.height - 100;
        this.player.velocityY = 0; // Reset vertical velocity for a clean restart
        this.offset = 0;
        this.loadLevel(this.currentLevel);
    }
    
    checkGameOver() {
        if (this.player.health <= 0) {
          this.gameOver = true;
        }
    }

    checkCollectibleCollision(player: Player, collectible: Collectible) {
        const playerBottom = player.y + player.height;
        const playerRight = player.x + player.width;
        const playerLeft = player.x;
        const playerTop = player.y;
    
        const collectibleBottom = collectible.y + collectible.height;
        const collectibleRight = collectible.x + collectible.width;
        const collectibleLeft = collectible.x;
        const collectibleTop = collectible.y;
    
        if (
          playerBottom > collectibleTop &&
          playerTop < collectibleBottom &&
          playerRight > collectibleLeft &&
          playerLeft < collectibleRight &&
          !collectible.collected
        ) {
          collectible.collect();
          this.score += 10; // Increase score when collected
        }
    }

    checkLevelProgress() {
        const allCollectiblesCollected = this.collectibles.every((collectible) => collectible.collected);
        if (allCollectiblesCollected) {
          this.currentLevel += 1;
          if (this.currentLevel > 2) {
            this.gameCompleted = true;
          } else {
              this.loadLevel(this.currentLevel);
          }
        }
    }

    gameFinish() {
        this.ctx.fillStyle = "green";
        this.ctx.font = "40px Arial";
        this.ctx.fillText("You Win! Press R to Restart", this.canvas.width / 2 - 250, this.canvas.height / 2);
    }

    checkCollision(player: Player, platform: Platform) {
        const playerBottom = player.y + player.height;
        const playerTop = player.y;
        const playerRight = player.x + player.width;
        const playerLeft = player.x;
      
        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const platformRight = platform.x + platform.width;
        const platformLeft = platform.x;
      
        // Check if player is falling onto the platform
        if (
          playerBottom > platformTop &&
          playerTop < platformBottom &&
          playerRight > platformLeft &&
          playerLeft < platformRight &&
          player.velocityY >= 0 // Player is falling
        ) {
          // Place the player on top of the platform
          player.y = platformTop - player.height;
          player.velocityY = 0;
          player.isJumping = false;
        }
      
        // Check if player is moving upwards and hits the underside of the platform
        if (
          playerTop < platformBottom &&
          playerBottom > platformTop &&
          playerRight > platformLeft &&
          playerLeft < platformRight &&
          player.velocityY < 0 // Player is moving up
        ) {
          // Prevent the player from passing through the bottom of the platform
          player.y = platformBottom;
          player.velocityY = 0;
        }
    }

    checkEnemyCollision(player: Player, enemy: Enemy) {
        const playerBottom = player.y + player.height;
        const playerTop = player.y;
        const playerRight = player.x + player.width;
        const playerLeft = player.x;
      
        const enemyTop = enemy.y;
        const enemyBottom = enemy.y + enemy.height;
        const enemyRight = enemy.x + enemy.width;
        const enemyLeft = enemy.x;
      
        if (
          playerBottom > enemyTop &&
          playerTop < enemyBottom &&
          playerRight > enemyLeft &&
          playerLeft < enemyRight
        ) {
          // Player has collided with the enemy
          player.takeDamage();
        }
    }
      

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    update() {
        if (this.gameOver || this.gameCompleted) return;

        const keys = this.inputHandler.getKeyState();
        this.player.update(keys);

        // Update player offset for background scrolling
        if (keys["ArrowLeft"] || keys["ArrowRight"]) {
          this.offset += keys["ArrowLeft"] ? -this.player.speed : this.player.speed;
        }

        // Update enemies
        this.enemies.forEach((enemy: Enemy) => {
            enemy.update(this.canvas.width);
        });

        // Check for collisions between the player and each platform
        this.platforms.forEach((platform: Platform) => {
            this.checkCollision(this.player, platform);
        });

        // Check for collisions between the player and each enemy
        this.enemies.forEach((enemy: Enemy) => {
            this.checkEnemyCollision(this.player, enemy);
        });

        // Check for collisions between the player and each collectible
        this.collectibles.forEach((collectible) => {
            this.checkCollectibleCollision(this.player, collectible);
        });

        // Update collectibles
        this.collectibles.forEach((collectible) => collectible.update());

        // Check for collisions between the player and each hazard
        this.hazards.forEach((hazard) => {
          if (hazard.checkCollision(this.player)) {
            this.player.takeDamage();
          }
        });

        // Update level progression
        this.checkLevelProgress();

        // Check if the game is over
        this.checkGameOver();
    }

    render() {
        this.clearCanvas();

        if (this.gameOver) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "40px Arial";
            this.ctx.fillText("Game Over! Press R to Restart", this.canvas.width / 2 - 250, this.canvas.height / 2);
            return;
        }

        if (this.gameCompleted) {
            this.gameFinish();
            return;
        }

        // Draw the parallax background
        this.parallaxBackground.draw(this.ctx, this.offset);

        // Draw platforms
        this.platforms.forEach((platform: Platform) => {
            platform.draw(this.ctx);
        })

        // Draw hazards
        this.hazards.forEach((hazard) => {
          hazard.draw(this.ctx);
        });

        // Draw enemies
        this.enemies.forEach((enemy: Enemy) => {
            enemy.draw(this.ctx);
        });

        // Draw collectibles
        this.collectibles.forEach((collectible) => {
            collectible.draw(this.ctx);
        });

        // Draw the player
        this.player.draw(this.ctx);

        // Draw UI
        this.drawUI();
    }

    drawUI() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width - 100, 30);
        this.ctx.fillText(`Level: ${this.currentLevel}`, this.canvas.width - 100, 60);
        this.ctx.fillText(`Health: ${this.player.health}`, this.canvas.width - 100, 90);
    }

    start() {
        const gameLoop = () => {
            this.update();
            this.render();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);

        // Add an event listener to restart the game
        window.addEventListener("keydown", (event) => {
            if (event.key === "r" || event.key === "R") {
                if (this.gameOver || this.gameCompleted) {
                    this.restartGame();
                }
            }
        });
    }
}