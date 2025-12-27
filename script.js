let solution = [];
let puzzle = [];

function newGame(level) {
    solution = generateSudoku();
    puzzle = JSON.parse(JSON.stringify(solution));

    let removeCount = level === 'easy' ? 40 : level === 'medium' ? 50 : 60;
    removeNumbers(puzzle, removeCount);
    renderBoard(puzzle);
}

function renderBoard(board) {
    const sudoku = document.getElementById("sudoku");
    sudoku.innerHTML = "";

    board.forEach((row, r) => {
        row.forEach((value, c) => {
            const input = document.createElement("input");
            if (value !== 0) {
                input.value = value;
                input.disabled = true;
            } else {
                input.addEventListener("input", () => validateInput(input, r, c));
            }
            sudoku.appendChild(input);
        });
    });
}

function validateInput(input, row, col) {
    const num = parseInt(input.value);
    input.classList.remove("invalid");

    if (!num || num < 1 || num > 9) {
        input.value = "";
        return;
    }

    if (num !== solution[row][col]) {
        input.classList.add("invalid");
    }
}

// ----------------- SUDOKU LOGIC -----------------

function generateSudoku() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solve(board);
    return board;
}

function solve(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                let nums = shuffle([1,2,3,4,5,6,7,8,9]);
                for (let n of nums) {
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

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }

    let sr = Math.floor(row / 3) * 3;
    let sc = Math.floor(col / 3) * 3;

    for (let r = sr; r < sr + 3; r++) {
        for (let c = sc; c < sc + 3; c++) {
            if (board[r][c] === num) return false;
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

// Start default game
newGame("easy");