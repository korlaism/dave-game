export class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    gravity: number;
    velocityY: number;
    canvasWidth: number;
    canvasHeight: number;
    isJumping: boolean;
    jumpForce: number;
    health: number;
    sprite: HTMLImageElement;
    flipImage: boolean;

    constructor(x: number, y: number, width: number, height: number, speed: number, canvasWidth: number, canvasHeight: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.gravity = 0.8;
        this.velocityY = 0;
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight;
        this.isJumping = false;
        this.jumpForce = -20;
        this.health = 3;
        this.sprite = new Image();
        this.sprite.src = "/assets/hero.png";
        this.flipImage = false;
    }

    update(keys: { [key: string]: boolean }) {
        if (keys["ArrowLeft"]) {
            this.x = Math.max(0, this.x - this.speed);
            this.flipImage = true;
        }
        if (keys["ArrowRight"]) {
            this.x = Math.min(this.canvasWidth - this.width, this.x + this.speed);
            this.flipImage = false;
        }
        if (keys["ArrowUp"] && !this.isJumping) {
            this.velocityY = this.jumpForce; // Apply an instantaneous upwards force
            this.isJumping = true;
        }
        
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }

        // check if player has landed
        if (this.y >= this.canvasHeight - this.height) {
            this.y = this.canvasHeight - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    takeDamage() {
        this.health -= 1;
        if (this.health <= 0) {
            console.log("Game Over!");
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Save the current state of the canvas
        ctx.save();

        if (this.flipImage) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        } else {
            ctx.translate(this.x, this.y);
            ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
        }

        // Restore the state of the canvas
        ctx.restore();
    }
}