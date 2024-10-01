export class Collectible {
    x: number;
    y: number;
    width: number;
    height: number;
    collected: boolean;
    originalY: number;
    oscillation: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collected = false;
        this.originalY = y;
        this.oscillation = 0;
    }

    update() {
        // Simple oscillation for visual effect
        this.oscillation += 0.05;
        this.y = this.originalY + Math.sin(this.oscillation) * 5;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.collected) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    collect() {
        this.collected = true;
    }
}