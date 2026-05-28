const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
 
canvas.width = 360;
canvas.height = 360;
 
const size = 3;
const cell = canvas.width / size;
 
// ★ 正しい魔法陣の一部を初期値にする（これなら必ず完成できる）
let grid = [
  [8, null, 6],
  [3, 5, null],
  [null, 9, 2]
];
 
let isComplete = false;
let glow = 0;
 
// -------------------------------
// 描画
// -------------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 3;
 
  for (let i = 1; i < size; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, canvas.height);
    ctx.stroke();
 
    ctx.beginPath();
    ctx.moveTo(0, i * cell);
    ctx.lineTo(canvas.width, i * cell);
    ctx.stroke();
  }
 
  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
 
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = grid[y][x];
      if (val !== null) {
        ctx.fillStyle = "#fff";
        ctx.fillText(val, x * cell + cell / 2, y * cell + cell / 2);
      }
    }
  }
 
  if (isComplete) {
    glow += 0.3;
    const alpha = Math.sin(glow) * 0.5 + 0.5;
 
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,0,${alpha})`;
    ctx.shadowColor = "#ff0";
    ctx.shadowBlur = 25;
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
 
    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = `rgba(255,255,0,${alpha})`;
    ctx.fillText("🎉 おめでとう！ 🎉", canvas.width / 2, canvas.height / 2);
  }
}
 
// -------------------------------
// 魔法陣チェック
// -------------------------------
function isMagicSquare() {
  const target = 15;
 
  if (!grid.flat().every(n => n !== null)) return false;
 
  const sums = [];
 
  for (let y = 0; y < size; y++) {
    sums.push(grid[y][0] + grid[y][1] + grid[y][2]);
  }
 
  for (let x = 0; x < size; x++) {
    sums.push(grid[0][x] + grid[1][x] + grid[2][x]);
  }
 
  sums.push(grid[0][0] + grid[1][1] + grid[2][2]);
  sums.push(grid[0][2] + grid[1][1] + grid[2][0]);
 
  return sums.every(s => s === target);
}
 
// -------------------------------
// クリック入力
// -------------------------------
canvas.addEventListener("click", (e) => {
  if (isComplete) return;
 
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cell);
  const y = Math.floor((e.clientY - rect.top) / cell);
 
  const num = prompt("数字を入力 (1〜9)");
  const n = Number(num);
 
  if (n >= 1 && n <= 9) {
    grid[y][x] = n;
 
    if (isMagicSquare()) {
      isComplete = true;
      animate();
    }
 
    draw();
  }
});
 
// -------------------------------
// アニメーションループ
// -------------------------------
function animate() {
  function loop() {
    if (!isComplete) return;
    draw();
    requestAnimationFrame(loop);
  }
  loop();
}
 
draw();