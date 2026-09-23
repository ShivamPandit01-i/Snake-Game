import { Snake } from './snake.js';
import { createFood } from './food.js';
import { wallCollision, bodyCollision, foodCollision } from './js/collision.js';

export class Game {
  constructor() {
    this.rows = 20;
    this.columns = 20;
    this.snake = new Snake();
    this.food = createFood(this.snake.getBody(), this.rows, this.columns);
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.score = 0;
    this.speed = 190;
    this.running = true;
    this.won = false;
  }

  setDirection(newDirection) {
    const opposite = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
    };
    if (opposite[newDirection] && newDirection !== opposite[this.nextDirection]) {
      this.nextDirection = newDirection;
    }
  }

  update() {
    if (!this.running) return;
    this.direction = this.nextDirection;

    const moves = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 }
    };
    const head = this.snake.getHead();
    const step = moves[this.direction];
    const newHead = { x: head.x + step.x, y: head.y + step.y };
    const ateFood = foodCollision(newHead, this.food);

    if (wallCollision(newHead, this.rows, this.columns) ||
        bodyCollision(newHead, this.snake.getBody(), ateFood)) {
      this.running = false;
      return;
    }

    this.snake.move(newHead);
    if (ateFood) {
      this.score++;
      this.food = createFood(this.snake.getBody(), this.rows, this.columns);
      if (this.food === null) {
        this.running = false;
        this.won = true;
      }
    } else {
      this.snake.removeTail();
    }
  }
}


