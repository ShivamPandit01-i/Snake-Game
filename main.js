import { Game } from './game.js';

const board = document.getElementById('game-board');
const scoreText = document.getElementById('score');
const bestText = document.getElementById('best');
const overlay = document.getElementById('game-overlay');
const titleText = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

let game;
let timer;
let gameState = 'ready';
let bestScore = 0;

// Remember the best score in this browser.
try {
  bestScore = Number(localStorage.getItem('snakeBestScore')) || 0;
} catch (error) {
  bestScore = 0;
}
bestText.textContent = bestScore;

function makeBoard() {
  for (let i = 0; i < 400; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    board.appendChild(cell);
  }
}

function drawGame() {
  const cells = board.children;

  for (const cell of cells) {
    cell.className = 'cell';
  }

  const snakeBody = game.snake.getBody();
  for (let i = 0; i < snakeBody.length; i++) {
    const part = snakeBody[i];
    const cellNumber = part.y * game.columns + part.x;
    cells[cellNumber].classList.add('snake');
    if (i === 0) cells[cellNumber].classList.add('head');
  }

  if (game.food !== null) {
    const foodNumber = game.food.y * game.columns + game.food.x;
    cells[foodNumber].classList.add('food');
  }

  scoreText.textContent = game.score;
}

function startGame() {
  clearInterval(timer);
  game = new Game();
  gameState = 'playing';
  overlay.classList.add('hidden');
  pauseButton.disabled = false;
  pauseButton.textContent = 'Pause';
  drawGame();
  timer = setInterval(moveGame, game.speed);
}

function moveGame() {
  game.update();
  drawGame();

  if (!game.running) {
    clearInterval(timer);
    gameState = 'over';
    pauseButton.disabled = true;

    if (game.score > bestScore) {
      bestScore = game.score;
      bestText.textContent = bestScore;
      try {
        localStorage.setItem('snakeBestScore', bestScore);
      } catch (error) {
        // The game still works when browser storage is unavailable.
      }
    }

    if (game.won) {
      showMessage('You Win!', 'You filled the whole board!', 'Play Again');
    } else {
      showMessage('Game Over', 'Your score was ' + game.score + '.', 'Play Again');
    }
  }
}

function showMessage(title, message, buttonText) {
  titleText.textContent = title;
  messageText.textContent = message;
  startButton.textContent = buttonText;
  overlay.classList.remove('hidden');
}

function pauseGame() {
  if (gameState === 'playing') {
    clearInterval(timer);
    gameState = 'paused';
    pauseButton.textContent = 'Continue';
    showMessage('Paused', 'Press Continue when you are ready.', 'Continue');
  } else if (gameState === 'paused') {
    gameState = 'playing';
    overlay.classList.add('hidden');
    pauseButton.textContent = 'Pause';
    timer = setInterval(moveGame, game.speed);
  }
}

function changeDirection(direction) {
  if (gameState === 'playing') game.setDirection(direction);
}

makeBoard();
game = new Game();
drawGame();
startButton.addEventListener('click', function () {
  if (gameState === 'paused') pauseGame();
  else startGame();
});
pauseButton.addEventListener('click', pauseGame);

document.addEventListener('keydown', function (event) {
  const keys = {
    ArrowUp: 'UP', w: 'UP', W: 'UP',
    ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
    ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
    ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT'
  };

  if (keys[event.key]) {
    event.preventDefault();
    changeDirection(keys[event.key]);
  }
  if (event.code === 'Space') {
    event.preventDefault();
    if (gameState === 'playing' || gameState === 'paused') pauseGame();
    else startGame();
  }
});

document.querySelectorAll('[data-direction]').forEach(function (button) {
  button.addEventListener('click', function () {
    changeDirection(button.dataset.direction);
  });
});

document.addEventListener('visibilitychange', function () {
  if (document.hidden && gameState === 'playing') pauseGame();
});
