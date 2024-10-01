export class ParallaxBackground {
    layers: HTMLImageElement[];
    speed: number[];
    yOffsets: number[];

    constructor(layerSource: string[], speed: number[], yOffsets: number[]) {
        this.layers = layerSource.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        this.speed = speed;
        this.yOffsets = yOffsets;
    }

    draw(ctx: CanvasRenderingContext2D, offset: number) {
        ctx.save();
        this.layers.forEach((layer, i) => {
            const xOffset = -offset * this.speed[i] % layer.width;
            const yOffset = this.yOffsets[i];
            // Draw two instances of each layer to create the scrolling effect
            ctx.drawImage(layer, xOffset, yOffset);
            ctx.drawImage(layer, xOffset + layer.width, yOffset);
        });
        ctx.restore();
    }
}