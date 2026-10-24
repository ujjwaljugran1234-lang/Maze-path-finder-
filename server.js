const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.post("/solve", (req, res) => {
  const maze = req.body && req.body.maze;
  if (!Array.isArray(maze) || maze.length !== 5 ||
      maze.some(row => !Array.isArray(row) || row.length !== 5 ||
      row.some(cell => cell !== 0 && cell !== 1))) {
    return res.status(400).json({ error: "maze must be a 5x5 array containing only 0 and 1." });
  }

  const input = maze.flat().join(" ") + "\n";
  const executable = path.join(__dirname, process.platform === "win32" ? "maze.exe" : "maze");
  const child = spawn(executable);
  let output = "";
  let errorOutput = "";

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", chunk => output += chunk);
  child.stderr.on("data", chunk => errorOutput += chunk);
  child.on("error", () => {
    if (!res.headersSent) res.status(500).json({ error: "C executable not found. Compile maze.c first." });
  });
  child.on("close", code => {
    if (res.headersSent) return;
    if (code !== 0) return res.status(500).json({ error: errorOutput || "C program failed." });
    try {
      res.json(JSON.parse(output));
    } catch {
      res.status(500).json({ error: "C program returned an invalid result." });
    }
  });
  child.stdin.end(input);
});

app.listen(3000, () => console.log("Maze API running at http://localhost:3000"));
