window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const gravity = 0.4;
  const bounce = 0.6;
  const pegs = [];
  const slots = [];
  const discRadius = 10;

  const pegSpacing = 50;
  const multipliers = [30, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 30];
  const slotCount = multipliers.length;
  const slotHeight = 50;

  let disc = null;
  let points = 0;
  const resultText = document.getElementById('resultText');

  document.getElementById('pointsInput').addEventListener('input', (e) => {
    points = parseInt(e.target.value) || 0;
  });

  function createTrianglePegs(rows = 10) {
    const spacingX = pegSpacing;
    const spacingY = pegSpacing;

    for (let r = 0; r < rows; r++) {
      let count = 3 + r;
      let offsetX = (canvas.width - count * spacingX) / 2;

      for (let i = 1; i < count; i++) {
        pegs.push({
          x: offsetX + i * spacingX,
          y: 60 + r * spacingY,
          radius: 6
        });
      }
    }
  }

  function createDisc() {
    return {
      x: canvas.width / 2,
      y: 10,
      vx: 0,
      vy: 0
    };
  }

  function updateDisc(d) {
    d.vy += gravity;
    d.x += d.vx;
    d.y += d.vy;

    // Colisiones con clavos
    pegs.forEach(p => {
      const dx = d.x - p.x;
      const dy = d.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = discRadius + p.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDist - dist;

        d.x += Math.cos(angle) * overlap;
        d.y += Math.sin(angle) * overlap;

        const speed = Math.sqrt(d.vx ** 2 + d.vy ** 2) || 2;
        const randomAngle = angle + (Math.random() - 0.5) * 1.2;

        d.vx = Math.cos(randomAngle) * speed * bounce;
        d.vy = Math.sin(randomAngle) * speed * bounce + 0.5;
      }
    });

    // Bordes laterales
    if (d.x < discRadius) {
      d.x = discRadius;
      d.vx *= -bounce;
    }
    if (d.x > canvas.width - discRadius) {
      d.x = canvas.width - discRadius;
      d.vx *= -bounce;
    }

    // Fondo (colisión con slots)
    if (d.y > canvas.height - slotHeight - discRadius) {
      checkSlotCollision(d);
      disc = null;
    }
  }

  function checkSlotCollision(d) {
    const slotWidth = pegSpacing;
    const offsetX = (canvas.width - slotCount * slotWidth) / 2;
    const index = Math.floor((d.x - offsetX) / slotWidth);
    const slot = slots[index];

    if (slot) {
      const winnings = Math.round(points * slot.multiplier);
      const creditosActuales = obtenerCreditos();
      actualizarCreditos(creditosActuales + winnings);

      resultText.textContent = `🎉 ¡Ganaste ${winnings} puntos (x${slot.multiplier})!`;
      resultText.className = "text-green-400 text-center text-[20px] mt-2";
    } else {
      resultText.textContent = `😢 ¡La bola salió fuera!`;
      resultText.className = "text-white text-center text-[20px] mt-2";
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clavos
    ctx.fillStyle = '#5AED68';
    pegs.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    drawSlots();

    if (disc) {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.arc(disc.x, disc.y, discRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    if (disc) {
      updateDisc(disc);
    }
    draw();
  }

  document.getElementById('drop').addEventListener('click', () => {
    if (!disc) {
      const puntosApostados = parseInt(document.getElementById('pointsInput').value) || 0;
      const creditosActuales = obtenerCreditos();

      if (puntosApostados <= 0) {
        resultText.textContent = "⚠️ Ingresa una apuesta válida.";
        resultText.className = "text-yellow-400 text-center text-[20px] mt-2";
        return;
      }

      if (puntosApostados > creditosActuales) {
        resultText.textContent = "❌ No tienes suficientes créditos.";
        resultText.className = "text-red-500 text-center text-[20px] mt-2";
        return;
      }

      actualizarCreditos(creditosActuales - puntosApostados);
      disc = createDisc();
      resultText.textContent = '';
      resultText.className = "text-white text-center text-[20px] mt-2";
    }
  });

  function createSlots() {
    const slotWidth = pegSpacing;
    const offsetX = (canvas.width - slotCount * slotWidth) / 2;

    for (let i = 0; i < slotCount; i++) {
      slots.push({
        x: offsetX + i * slotWidth,
        width: slotWidth,
        multiplier: multipliers[i]
      });
    }
  }

  function drawSlots() {
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';

    slots.forEach((slot) => {
      ctx.fillStyle = '#333';
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      ctx.rect(slot.x, canvas.height - slotHeight, slot.width, slotHeight);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.fillText(`x${slot.multiplier}`, slot.x + slot.width / 2, canvas.height - 12);
    });
  }

  createTrianglePegs();
  createSlots();
  loop();
});