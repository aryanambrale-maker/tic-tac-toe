// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Gameboard Module (IIFE)
const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, marker) => {
    if (board[index] !== "") return false;
    board[index] = marker;
    return true;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, setMark, resetBoard };
})();

// Game Controller Module (IIFE)
const GameController = (() => {
  let players = [Player("Player 1", "X"), Player("Player 2", "O")];
  let activePlayer = players[0];
  let isGameOver = false;
  let statusMessage = `${activePlayer.name}'s turn (${activePlayer.marker})`;

  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    return winConditions.some((combination) => {
      const [a, b, c] = combination;
      return board[a] !== "" && board[a] === board[b] && board[a] === board[c];
    });
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const playRound = (index) => {
    if (isGameOver) return;

    const moveSuccess = Gameboard.setMark(index, activePlayer.marker);
    if (!moveSuccess) return; // Spot already taken

    if (checkWinner()) {
      statusMessage = `${activePlayer.name} (${activePlayer.marker}) wins! 🎉`;
      isGameOver = true;
      return;
    }

    if (checkTie()) {
      statusMessage = "It's a tie! 🤝";
      isGameOver = true;
      return;
    }

    switchPlayerTurn();
    statusMessage = `${activePlayer.name}'s turn (${activePlayer.marker})`;
  };

  const startNewGame = (name1, name2) => {
    players = [
      Player(name1 || "Player 1", "X"),
      Player(name2 || "Player 2", "O")
    ];
    activePlayer = players[0];
    isGameOver = false;
    Gameboard.resetBoard();
    statusMessage = `${activePlayer.name}'s turn (${activePlayer.marker})`;
  };

  const getStatusMessage = () => statusMessage;

  return { playRound, startNewGame, getStatusMessage };
})();

// Display / DOM Controller Module (IIFE)
const DisplayController = (() => {
  const boardElement = document.getElementById("gameboard");
  const statusElement = document.getElementById("status-display");
  const restartBtn = document.getElementById("restart-btn");
  const p1Input = document.getElementById("player1-name");
  const p2Input = document.getElementById("player2-name");

  const render = () => {
    boardElement.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((cellValue, index) => {
      const cellBtn = document.createElement("button");
      cellBtn.classList.add("cell");
      if (cellValue === "X") cellBtn.classList.add("x-mark");
      if (cellValue === "O") cellBtn.classList.add("o-mark");
      cellBtn.textContent = cellValue;

      cellBtn.addEventListener("click", () => {
        GameController.playRound(index);
        render();
      });

      boardElement.appendChild(cellBtn);
    });

    statusElement.textContent = GameController.getStatusMessage();
  };

  restartBtn.addEventListener("click", () => {
    GameController.startNewGame(p1Input.value.trim(), p2Input.value.trim());
    render();
  });

  // Initial render
  render();
})();