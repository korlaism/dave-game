export class Hazard {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(player: { x: number, y: number, width: number, height: number }) {
        const playerBottom = player.y + player.height;
        const playerRight = player.x + player.width;
        const playerLeft = player.x;
        const playerTop = player.y;

        const hazardBottom = this.y + this.height;
        const hazardRight = this.x + this.width;
        const hazardLeft = this.x;
        const hazardTop = this.y;

        return (
            playerBottom > hazardTop &&
            playerTop < hazardBottom &&
            playerRight > hazardLeft &&
            playerLeft < hazardRight
        )
    }
}