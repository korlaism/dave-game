export class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    direction: number; // 1 for right, -1 for left

    constructor(x: number, y: number, width: number, height: number, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 1;
    }

    update(canvasWidth: number) {
        this.x += this.speed * this.direction;
        if (this.x + this.width > canvasWidth || this.x < 0) {
            this.direction *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}