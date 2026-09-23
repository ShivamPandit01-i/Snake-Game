export function randomPosition(rows, columns) {
  return {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows)
  };
}
