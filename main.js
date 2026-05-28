const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 360;
canvas.height = 360;
const size = 3;
const cell = canvas.width / size;

const ALL_MAGIC = [
  [[2,7,6],[9,5,1],[4,3,8]],
  [[2,9,4],[7,5,3],[6,1,8]],
  [[4,9,2],[3,5,7],[8,1,6]],
  [[4,3,8],[9,5,1],[2,7,6]],
  [[6,1,8],[7,5,3],[2,9,4]],
  [[6,7,2],[1,5,9],[8,3,4]],
  [[8,1,6],[3,5,7],[4,9,2]],
  [[8,3,4],[1,5,9],[6,7,2]],
];

let grid = [], fixed = [], isComplete = false, glow = 0;

function generatePuzzle() {
  const base = ALL_MAGIC[Math.floor(Math.random() * ALL_MAGIC.length)];
  const blanks = 3 + Math.floor(Math.random() * 2);
  const positions = [];
  while (positions.length < blanks) {
    const p = Math.floor(Math.random() * 9);
    if (!positions.includes(p)) positions.push(p);
  }
  grid = []; fixed = [];
  for (let y = 0; y < size; y++) {
    grid.push([]); fixed.push([]);
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      if (positions.includes(idx)) {
        grid[y].push(null);
        fixed[y].push(false);
      } else {
        grid[y].push(base[y][x]);
        fixed[y].push(true);
      }
    }
  }
  isComplete = false; glow = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f0f4ff";
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
  ctx.fill();

  ctx.strokeStyle = "#3366aa";
  ctx.lineWidth = 2;
  for (let i = 1; i < size; i++) {
    ctx.beginPath(); ctx.moveTo(i * cell, 8); ctx.lineTo(i * cell, canvas.height - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, i * cell); ctx.lineTo(canvas.width - 8, i * cell); ctx.stroke();
  }

  ctx.font = "bold 52px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = grid[y][x];
      if (val !== null) {
        ctx.fillStyle = fixed[y][x] ? "#1144aa" : "#005533";
        ctx.fillText(val, x * cell + cell / 2, y * cell + cell / 2);
      } else {
        ctx.fillStyle = "rgba(0,0,180,0.06)";
        ctx.beginPath();
        ctx.roundRect(x * cell + 10, y * cell + 10, cell - 20, cell - 20, 8);
        ctx.fill();
        ctx.fillStyle = "rgba(0,0,150,0.15)";
        ctx.font = "18px sans-serif";
        ctx.fillText("?", x * cell + cell / 2, y * cell + cell / 2);
        ctx.font = "bold 52px sans-serif";
      }
    }
  }

  if (isComplete) {
    glow += 0.08;
    const alpha = Math.sin(glow) * 0.45 + 0.55;
    ctx.save();
    ctx.strokeStyle = `rgba(255,220,0,${alpha})`;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(3, 3, canvas.width - 6, canvas.height - 6, 14);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${alpha * 0.55})`;
    ctx.beginPath();
    ctx.roundRect(40, canvas.height / 2 - 40, canvas.width - 80, 80, 10);
    ctx.fill();
    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = `rgba(255,230,80,${alpha})`;
    ctx.fillText("おめでとう！", canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }
}

function isMagicSquare() {
  if (!grid.flat().every(n => n !== null)) return false;
  const sums = [];
  for (let y = 0; y < size; y++) sums.push(grid[y].reduce((a, b) => a + b, 0));
  for (let x = 0; x < size; x++) sums.push(grid[0][x] + grid[1][x] + grid[2][x]);
  sums.push(grid[0][0] + grid[1][1] + grid[2][2]);
  sums.push(grid[0][2] + grid[1][1] + grid[2][0]);
  return sums.every(s => s === 15);
}

canvas.addEventListener("click", (e) => {
  if (isComplete) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / (rect.width / size));
  const y = Math.floor((e.clientY - rect.top) / (rect.height / size));
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  if (fixed[y][x]) return;
  const num = prompt("数字を入力 (1〜9)");
  const n = Number(num);
  if (n >= 1 && n <= 9) {
    grid[y][x] = n;
    if (isMagicSquare()) {
      isComplete = true;
      (function loop() { if (!isComplete) return; draw(); requestAnimationFrame(loop); })();
    } else {
      draw();
    }
  }
});

// 新しい問題を生成する場合はこの関数を呼ぶ
function resetPuzzle() {
  generatePuzzle();
  draw();
}

generatePuzzle();
draw();
