let currentMode = 'easy';
let board = Array(9).fill(null);
let isPlayerTurn = true;
let gameOver = false;

function setMode(mode) {
    currentMode = mode;
    document.getElementById('chosen-level').innerText = `Chosen Level: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    document.getElementById('chosen-level').classList.remove('hidden');
    resetGame();
    toggleModeSelection();
}

function toggleModeSelection() {
    document.getElementById('mode-selection').classList.toggle('hidden');
}

function resetGame() {
    board = Array(9).fill(null);
    isPlayerTurn = true;
    gameOver = false;
    document.getElementById('chosen-level').classList.add('hidden');
    for (let i = 0; i < 9; i++) {
        let cell = document.getElementById(`cell-${i}`);
        cell.innerText = '';
        cell.classList.remove('disabled');
        cell.classList.remove('win-line');
    }
}

function playerMove(position) {
    if (!board[position] && isPlayerTurn && !gameOver) {
        board[position] = 'X';
        document.getElementById(`cell-${position}`).innerText = 'X';

        if (checkWin('X')) {
            endGame('Player 1 wins!');
            return;
        } else if (board.every(cell => cell)) {
            endGame('It\'s a draw!');
            return;
        }

        isPlayerTurn = false;

        if (currentMode === 'easy') {
            setTimeout(botMoveEasy, 700);
        } else if (currentMode === 'medium') {
            setTimeout(botMoveMedium, 700);
        } else if (currentMode === 'impossible') {
            setTimeout(botMoveImpossible, 700);
        }
    } else if (currentMode === 'friend' && board[position] === null && !gameOver) {
        board[position] = isPlayerTurn ? 'X' : 'O';
        document.getElementById(`cell-${position}`).innerText = isPlayerTurn ? 'X' : 'O';

        if (checkWin(isPlayerTurn ? 'X' : 'O')) {
            endGame(`${isPlayerTurn ? 'Player 1' : 'Player 2'} wins!`);
            return;
        } else if (board.every(cell => cell)) {
            endGame('It\'s a draw!');
            return;
        }
        isPlayerTurn = !isPlayerTurn;
    }
}

function botMoveEasy() { if (!gameOver) makeBotMove(randomMove()); }
function botMoveMedium() { if (!gameOver) makeBotMove(Math.random() < 0.5 ? randomMove() : minimax(board, 'O').index); }
function botMoveImpossible() { if (!gameOver) makeBotMove(minimax(board, 'O').index); }

function randomMove() {
    let emptyCells = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function makeBotMove(position) {
    board[position] = 'O';
    document.getElementById(`cell-${position}`).innerText = 'O';

    if (checkWin('O')) {
        endGame('Bot wins!');
        return;
    } else if (board.every(cell => cell)) {
        endGame('It\'s a draw!');
        return;
    }

    isPlayerTurn = true;
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let combo of winningCombinations) {
        if (combo.every(index => board[index] === player)) {
            combo.forEach(index => document.getElementById(`cell-${index}`).classList.add('win-line'));
            return true;
        }
    }
    return false;
}

function endGame(message) {
    gameOver = true;
    document.getElementById('game-message').innerText = message;
    document.getElementById('clapping-sound').play();
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell-${i}`).classList.add('disabled');
    }
}

function minimax(newBoard, player) {
    const emptyCells = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (checkWinForMinimax(newBoard, 'X')) return { score: -10 };
    if (checkWinForMinimax(newBoard, 'O')) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i of emptyCells) {
        newBoard[i] = player;
        moves.push({
            index: i,
            score: player === 'O' ? minimax(newBoard, 'X').score : minimax(newBoard, 'O').score
        });
        newBoard[i] = null;
    }
    return moves.reduce((bestMove, move) =>
        (player === 'O' ? move.score > bestMove.score : move.score < bestMove.score) ? move : bestMove);
}

function checkWinForMinimax(newBoard, player) {
    return [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ].some(combo => combo.every(index => newBoard[index] === player));
}
