export class Snake {
  constructor() {
    this.body = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
  }

  getHead() { return this.body[0]; }
  getBody() { return this.body; }
  move(newHead) { this.body.unshift(newHead); }
  removeTail() { this.body.pop(); }
}
