const SIZE = 5;
const START = [0, 0];
const FINISH = [4, 4];
const mazeEl = document.getElementById("maze");
const statusEl = document.getElementById("status");
const solveBtn = document.getElementById("solveBtn");
let walls = new Set();
let pathCells = new Set();

function key(r, c) { return `${r},${c}`; }

function renderMaze() {
  mazeEl.innerHTML = "";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
      const k = key(r, c);
      if (r === START[0] && c === START[1]) cell.classList.add("start");
      else if (r === FINISH[0] && c === FINISH[1]) cell.classList.add("end");
      else if (walls.has(k)) cell.classList.add("wall");
      else if (pathCells.has(k)) cell.classList.add("path");

      cell.addEventListener("click", () => {
        if ((r === START[0] && c === START[1]) ||
            (r === FINISH[0] && c === FINISH[1])) return;
        if (walls.has(k)) walls.delete(k);
        else walls.add(k);
        pathCells.clear();
        statusEl.textContent = "Walls updated. Press Find Path.";
        renderMaze();
      });
      mazeEl.appendChild(cell);
    }
  }
}

solveBtn.addEventListener("click", async () => {
  const maze = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => walls.has(key(r, c)) ? 1 : 0)
  );
  solveBtn.disabled = true;
  statusEl.textContent = "Sending maze to the API and C program...";
  pathCells.clear();
  try {
    const response = await fetch("http://localhost:3000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maze })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API request failed");
    pathCells = new Set((data.path || []).map(([r, c]) => key(r, c)));
    renderMaze();
    statusEl.textContent = data.path.length
      ? `Path found! ${data.path.length} cells. Solved by the C program.`
      : "No path found. Try removing a wall.";
  } catch (err) {
    statusEl.textContent = `Connection error: ${err.message}. Check that the API server is running.`;
  } finally {
    solveBtn.disabled = false;
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  walls.clear();
  pathCells.clear();
  statusEl.textContent = "Walls cleared. Add walls or find a path.";
  renderMaze();
});

renderMaze();
