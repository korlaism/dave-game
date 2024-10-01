import { Enemy } from "./enemy";

export class PatrollingEnemy extends Enemy {
    range: number;
    originalX: number;

    constructor(x: number, y: number, width: number, height: number, speed: number, range: number) {
        super(x, y, width, height, speed);
        this.range = range;
        this.originalX = x;
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x > this.originalX + this.range || this.x < this.originalX -this.range) {
            this.direction *= -1;
        }
    }
}

export class JumpingEnemy extends Enemy {
    gravity: number;
    velocityY: number;
    jumpInterval: number;
    jumpTimer: number;
  
    constructor(x: number, y: number, width: number, height: number, speed: number, jumpInterval: number) {
        super(x, y, width, height, speed);
        this.gravity = 0.8;
        this.velocityY = 0;
        this.jumpInterval = jumpInterval;
        this.jumpTimer = 0;
    }
  
    update() {
        this.x += this.speed * this.direction;
        this.jumpTimer++;
    
        // Jump periodically
        if (this.jumpTimer >= this.jumpInterval) {
            this.velocityY = -10; // Jump force
            this.jumpTimer = 0;
        }
    
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
    
        // Prevent falling through the ground
        if (this.y > 400) { // Assuming ground level at y = 400
            this.y = 400;
            this.velocityY = 0;
        }
    }
}