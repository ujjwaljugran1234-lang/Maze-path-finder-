MAZE PATH FINDER — FRONTEND + API + C

Files:
- index.html: page structure
- style.css: design
- script.js: creates the grid and sends the maze to the API
- server.js: Express API at POST /solve; runs the C program
- maze.c: BFS path-finding algorithm
- package.json: Node.js dependencies

REQUIREMENTS:
- Node.js installed
- GCC compiler installed (or another C compiler; commands may differ)

RUN ON WINDOWS:
1. Extract this ZIP into a folder.
2. Open Command Prompt/terminal in that folder.
3. Compile C:
   gcc maze.c -o maze.exe
4. Install API packages:
   npm install
5. Start API:
   npm start
6. Keep that terminal open.
7. Open index.html in your browser.
8. Click cells to add/remove walls, then click "Find Path (C API)".

RUN ON Linux/macOS:
1. Open terminal in this folder.
2. Compile C:
   gcc maze.c -o maze
3. Install API packages:
   npm install
4. Start API:
   npm start
5. Keep that terminal open.
6. Open index.html in your browser and use Find Path.

HOW IT CONNECTS:
Browser JavaScript -> POST http://localhost:3000/solve -> Express server
-> runs compiled C program -> C returns JSON path -> browser highlights path.

Maze values:
0 = open cell
1 = wall
Start = top-left [0,0]
Finish = bottom-right [4,4]

If browser security/CORS or local file restrictions cause problems, serve the frontend from a local web server. The API still runs separately on port 3000.
