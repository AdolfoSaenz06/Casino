document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gridSize = 5;
  const cellSize = canvas.width / gridSize;
  let revealed = [];
  let mines = [];
  let gameOver = false;
  let reward = 1;
  let bet = 0;
  let diamondsFound = 0;

  function initGame() {
    revealed = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    mines = [];
    gameOver = false;
    reward = 1;
    diamondsFound = 0;

    while (mines.length < 5) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      if (!mines.some(m => m.x === x && m.y === y)) {
        mines.push({ x, y });
      }
    }

    drawGrid();
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const px = x * cellSize;
        const py = y * cellSize;

        ctx.fillStyle = revealed[x][y] ? "#333" : "#5AED68";
        ctx.fillRect(px, py, cellSize - 1, cellSize - 1);

        if (revealed[x][y]) {
          if (mines.some(m => m.x === x && m.y === y)) {
            ctx.fillStyle = "red";
            ctx.fillText("💣", px + cellSize / 2, py + cellSize / 2);
          } else {
            ctx.fillStyle = "white";
            ctx.fillText("💎", px + cellSize / 2, py + cellSize / 2);
          }
        }
      }
    }
  }

  canvas.addEventListener("click", (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (revealed[x][y]) return;

    revealed[x][y] = true;

    if (mines.some(m => m.x === x && m.y === y)) {
      document.getElementById("resultText").innerText = "¡Perdiste! 💣";
      gameOver = true;
      drawGrid();
    } else {
      diamondsFound++;

      if (diamondsFound === 1) reward = 0.5;
      else if (diamondsFound === 2) reward = 1;
      else reward *= 1.3;

      drawGrid();
      document.getElementById("resultText").innerText = `Premio actual: ${Math.floor(bet * reward)} créditos`;
    }
  });

  document.getElementById("drop").addEventListener("click", () => {
    if (gameOver === false && reward > 1) {
      document.getElementById("resultText").innerText = "Finaliza el juego actual primero.";
      return;
    }

    const input = document.getElementById("pointsInput");
    bet = parseInt(input.value);
    if (isNaN(bet) || bet <= 0) {
      alert("Ingresa una apuesta válida.");
      return;
    }

    const creditos = obtenerCreditos();
    if (creditos < bet) {
      alert("No tienes suficientes créditos.");
      return;
    }

    actualizarCreditos(creditos - bet);
    document.getElementById("resultText").innerText = `¡Apuesta iniciada con ${bet} créditos!`;
    initGame();
  });

  document.getElementById("stop").addEventListener("click", () => {
    if (gameOver || reward < 1) {
      document.getElementById("resultText").innerText = "No puedes retirarte aún. Encuentra al menos 2 diamantes.";
      return;
    }

    const ganancia = Math.floor(bet * reward);
    añadirCreditos(ganancia);
    document.getElementById("resultText").innerText = `Te retiraste con ${ganancia} créditos 💰`;
    gameOver = true;
    drawGrid();
  });

  initGame();
});