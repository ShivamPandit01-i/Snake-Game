export function wallCollision(head, rows, columns) {
  return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
}

export function bodyCollision(head, snake, ateFood) {
  // The tail moves away on a normal move, so do not check its old square.
  let bodyToCheck = snake;
  if (!ateFood) bodyToCheck = snake.slice(0, -1);

  return bodyToCheck.some(function (part) {
    return part.x === head.x && part.y === head.y;
  });
}

export function foodCollision(head, food) {
  return food !== null && head.x === food.x && head.y === food.y;
}
