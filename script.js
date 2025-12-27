let solution = [];
let puzzle = [];
let timerInterval;
let seconds = 0;
let lives = 3;
let currentLevel = "";
let gameOver = false;

function startGame(level) {
  currentLevel = level;
  lives = 3;
  seconds = 0;
  gameOver = false;

  document.getElementById("menu").classList.add("hidden");
  document.getElementById("top-bar").classList.remove("hidden");
  document.getElementById("message").innerText = "";
  updateLives();

  solution = generateSudoku();
  puzzle = JSON.parse(JSON.stringify(solution));

  let removeCount = level === "easy" ? 40 : level === "medium" ? 50 : 60;
  removeNumbers(puzzle, removeCount);

  renderBoard(puzzle);
  startTimer();
}

function resetGame() {
  clearInterval(timerInterval);
  gameOver = false;

  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("top-bar").classList.add("hidden");

  document.getElementById("sudoku").innerHTML = "";
  document.getElementById("sudoku").classList.remove("hide-board");

  document.getElementById("timer").innerText = "00:00:00";
  document.getElementById("message").innerText = "";
}

function renderBoard(board) {
  const sudoku = document.getElementById("sudoku");
  sudoku.innerHTML = "";

  board.forEach((row, r) => {
    row.forEach((value, c) => {
      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";     // 📱 Android + iOS
      input.pattern = "[0-9]*";        // 🍎 iOS Safari
      input.className = "cell";
      input.maxLength = 1;

      if (value !== 0) {
        input.value = value;
        input.disabled = true;
      } else {
        input.addEventListener("input", () => handleInput(input, r, c));
      }

      sudoku.appendChild(input);
    });
  });
}

function handleInput(input, r, c) {
  if (gameOver) return;

  const val = parseInt(input.value);
  input.classList.remove("invalid");

  if (!val || val < 1 || val > 9) {
    input.value = "";
    return;
  }

  if (val !== solution[r][c]) {
    input.classList.add("invalid");
    input.value = "";
    wrongAttempt();
  } else {
    puzzle[r][c] = val;
    checkWin();
  }
}

function wrongAttempt() {
  lives--;
  updateLives();
  document.getElementById("alarm").play();

  if (lives === 0) {
    gameOver = true;
    clearInterval(timerInterval);

    // 🔥 HIDE SUDOKU BOARD
    document.getElementById("sudoku").classList.add("hide-board");

    // 📢 SHOW LOSS MESSAGE
    document.getElementById("message").innerText =
      `❌ You Lost!\nYou failed ${currentLevel.toUpperCase()} level.\nTry again.`;
  }
}
function updateLives() {
  document.getElementById("lives").innerText = "❤️".repeat(lives);
}

function checkWin() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] !== solution[r][c]) return;
    }
  }

  clearInterval(timerInterval);
  document.getElementById("message").innerText =
    `🎉 Congratulations!\nYou solved ${currentLevel.toUpperCase()} in ${formatTime(seconds)}`;
}

// -------- TIMER --------
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").innerText = formatTime(seconds);
  }, 1000);
}

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// -------- SUDOKU ENGINE --------
function generateSudoku() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(board);
  return board;
}

function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let n of shuffle([1,2,3,4,5,6,7,8,9])) {
          if (isValid(board, r, c, n)) {
            board[r][c] = n;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, r, c, n) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === n || board[i][c] === n) return false;
  }

  const sr = Math.floor(r / 3) * 3;
  const sc = Math.floor(c / 3) * 3;

  for (let i = sr; i < sr + 3; i++) {
    for (let j = sc; j < sc + 3; j++) {
      if (board[i][j] === n) return false;
    }
  }
  return true;
}

function removeNumbers(board, count) {
  while (count > 0) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      board[r][c] = 0;
      count--;
    }
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
