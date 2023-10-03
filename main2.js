const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const playerScore = document.getElementById('player-score');
const computerScore = document.getElementById('computer-score');

let currentPlayer = 'X';
let playerPoints = 0;
let computerPoints = 0;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

canvas.addEventListener('click', handleCanvasClick);
resetButton.addEventListener('click', handleReset);

// Função para desenhar o tabuleiro
function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    // Linhas horizontais
    context.beginPath();
    context.moveTo(0, 100);
    context.lineTo(300, 100);
    context.stroke();
    context.beginPath();
    context.moveTo(0, 200);
    context.lineTo(300, 200);
    context.stroke();

    // Linhas verticais
    context.beginPath();
    context.moveTo(100, 0);
    context.lineTo(100, 300);
    context.stroke();
    context.beginPath();
    context.moveTo(200, 0);
    context.lineTo(200, 300);
    context.stroke();

    for (let i = 0; i < gameBoard.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const cellValue = gameBoard[i];
        context.font = '80px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        if (cellValue === 'X') {
            context.fillStyle = 'green';
            context.fillText('X', col * 100 + 50, row * 100 + 50);
        } else if (cellValue === 'O') {
            context.fillStyle = 'red';
            context.fillText('O', col * 100 + 50, row * 100 + 50);
        }
    }
}

// Função para verificar o vencedor
function checkWinner() {
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    if (!gameBoard.includes('')) {
        return 'T';
    }
    return null;
}

// Função para lidar com o clique no canvas
function handleCanvasClick(event) {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / 100);
    const col = Math.floor(x / 100);
    const cellIndex = row * 3 + col;

    if (gameBoard[cellIndex] === '') {
        gameBoard[cellIndex] = currentPlayer;
        drawBoard();
        const winner = checkWinner();
        if (winner) {
            gameActive = false;
            if (winner === 'T') {
                message.textContent = 'Empate!';
            } else if (winner === 'X') {
                message.textContent = 'Você venceu!';
                message.style.color = 'green';
                playerPoints++;
                playerScore.textContent = playerPoints;
            } else {
                message.textContent = 'A máquina venceu!';
                message.style.color = 'red';
                computerPoints++;
                computerScore.textContent = computerPoints;
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O' && gameActive) {
                setTimeout(computerMove, 500); // Espera meio segundo antes do movimento da máquina
            }
        }
    }
}

// Função para lidar com o movimento da máquina
function computerMove() {
    const availableCells = gameBoard.reduce((acc, val, index) => {
        if (val === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    // Escolha um movimento aleatório para a máquina
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const computerChoice = availableCells[randomIndex];
    gameBoard[computerChoice] = 'O';
    drawBoard();

    // Verifique se há um vencedor após o movimento da máquina
    const winner = checkWinner();
    if (winner) {
        gameActive = false;
        if (winner === 'T') {
            message.textContent = 'Empate!';
        } else if (winner === 'X') {
            message.textContent = 'Você venceu!';
            message.style.color = 'green';
            playerPoints++;
            playerScore.textContent = playerPoints;
        } else {
            message.textContent = 'A máquina venceu!';
            message.style.color = 'red';
            computerPoints++;
            computerScore.textContent = computerPoints;
        }
    } else {
        currentPlayer = 'X';
    }
}

// Função para lidar com o reinício do jogo
function handleReset() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = '';
    currentPlayer = 'X';
    drawBoard();
}

// Inicialize o jogo desenhando o tabuleiro vazio
drawBoard();

// Faça a máquina fazer o primeiro movimento aleatório
if (currentPlayer === 'O') {
    setTimeout(computerMove, 500);
}