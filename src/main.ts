// src/main.ts

import { GameLoop } from "./core/gameLoop";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error("Unable to find the game canvas element");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Unable to get 2D context from canvas");
}

// Initialize the game loop and start the game
const gameLoop = new GameLoop(ctx, canvas);
gameLoop.start();