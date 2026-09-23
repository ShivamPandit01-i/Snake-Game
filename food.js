import { randomPosition } from './utils.js';

export function createFood(snake, rows, columns) {
  if (snake.length === rows * columns) return null;

  let food;
  do {
    food = randomPosition(rows, columns);
  } while (snake.some(function (part) {
    return part.x === food.x && part.y === food.y;
  }));

  return food;
}
