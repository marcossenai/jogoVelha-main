// Seleciona o elemento canvas com o ID 'game-board' do HTML
const canvas = document.getElementById('game-board');
// Permite que o canvas seja desenhado
const context = canvas.getContext('2d');
// Seleciona o elemento HTML que exibirá mensagens (como quem ganhou)
const message = document.getElementById('message');
// Seleciona o botão de reiniciar do HTML para adicionar funcionalidade a ele posteriormente
const resetButton = document.getElementById('reset-button');
// Seleciona o elemento HTML que exibe a pontuação do jogador
const playerScore = document.getElementById('player-score');
// Seleciona o elemento HTML que exibe a pontuação do computador/jogador 2
const computerScore = document.getElementById('computer-score');

// Define o jogador atual como 'X' (o jogo sempre começa com o jogador 'X')
let currentPlayer = 'X';
// Inicializa a pontuação do jogador com 0
let playerPoints = 0;
// Inicializa a pontuação do computador/jogador 2 com 0
let computerPoints = 0;
// Inicializa o tabuleiro do jogo da velha como um array vazio de 9 elementos
let gameBoard = ['', '', '', '', '', '', '', '', ''];
// Define se o jogo está ativo. Inicialmente, é verdadeiro.
let gameActive = true;

// Define as combinações vencedoras possíveis para o jogo da velha
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

// Adiciona um ouvinte de evento para capturar cliques no canvas
canvas.addEventListener('click', handleCanvasClick);
// Adiciona um ouvinte de evento ao botão de reiniciar para reiniciar o jogo quando clicado
resetButton.addEventListener('click', handleReset);

// Função para desenhar o tabuleiro e os movimentos dos jogadores
function drawBoard() {
    // Limpa o canvas para um novo desenho
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Define a cor e a largura das linhas
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    // Desenha as duas linhas horizontais do tabuleiro
    context.beginPath();
    context.moveTo(0, 100);
    context.lineTo(300, 100);
    context.stroke();

    context.beginPath();
    context.moveTo(0, 200);
    context.lineTo(300, 200);
    context.stroke();

    // Desenha as duas linhas verticais do tabuleiro
    context.beginPath();
    context.moveTo(100, 0);
    context.lineTo(100, 300);
    context.stroke();

    context.beginPath();
    context.moveTo(200, 0);
    context.lineTo(200, 300);
    context.stroke();

    // Percorre o tabuleiro e desenha 'X' ou 'O' dependendo do valor da célula
    for (let i = 0; i < gameBoard.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const cellValue = gameBoard[i];

        context.font = '80px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Se a célula contém 'X', desenha um 'X' verde
        if (cellValue === 'X') {
            context.fillStyle = 'green';
            context.fillText('X', col * 100 + 50, row * 100 + 50);
        } 
        // Se a célula contém 'O', desenha um 'O' azul
        else if (cellValue === 'O') {
            context.fillStyle = 'blue';
            context.fillText('O', col * 100 + 50, row * 100 + 50);
        }
    }
}

// Função para verificar se há um vencedor ou se o jogo terminou em empate
function checkWinner() {
    // Percorre todas as combinações vencedoras para verificar se alguma se aplica ao estado atual
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    // Verifica se todas as células estão preenchidas (empate)
    if (!gameBoard.includes('')) {
        return 'T';
    }
    // Se nenhuma condição acima for atendida, retorna null (jogo ainda em andamento)
    return null;
}

// Função para lidar com o clique no canvas
function handleCanvasClick(event) {
    // Se o jogo não estiver ativo, não faça nada
    if (!gameActive) return;

    // Calcula a posição do clique em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Determina a célula do tabuleiro que foi clicada
    const row = Math.floor(y / 100);
    const col = Math.floor(x / 100);
    const cellIndex = row * 3 + col;

    // Se a célula estiver vazia, preenche com o movimento do jogador atual
    if (gameBoard[cellIndex] === '') {
        gameBoard[cellIndex] = currentPlayer;
        // Redesenha o tabuleiro com o novo movimento
        drawBoard();
        // Verifica se há um vencedor após o movimento
        const winner = checkWinner();
        if (winner) {
            gameActive = false;
            if (winner === 'T') {
                message.textContent = 'Empate!';
            } else if (winner === 'X') {
                message.textContent = 'Jogador 1 venceu!';
                message.style.color = 'green';
                playerPoints++;
                playerScore.textContent = playerPoints;
            } else {
                message.textContent = 'Jogador 2 venceu!';
                message.style.color = 'blue';
                computerPoints++;
                computerScore.textContent = computerPoints;
            }
        } else {
            // Alterna o jogador atual
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Função para reiniciar o jogo
function handleReset() {
    // Limpa o tabuleiro
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    // Define o jogo como ativo
    gameActive = true;
    // Limpa a mensagem de vencedor
    message.textContent = '';
    // Define 'X' como o jogador inicial
    currentPlayer = 'X';
    // Redesenha o tabuleiro vazio
    drawBoard();
}

// Inicializa o jogo desenhando o tabuleiro vazio
drawBoard();
