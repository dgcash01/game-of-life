let canvas; // = document.getElementById("canvas");
let context; // = canvas.getContext("2d");
let arr; // new Array(resolution);
const size = 800;
const scale = 10;
const resolution = size / scale;
let started = false;
let paused = false;
let startBtn;
let cells; // = createCells();
let pauseBtn;
let nextStep;
let now;
let then = Date.now();

// evenCells();
//startGame();

setInterval(step, 50);

function startGame() {
  // starting and restarting the game
  setup();
  oddCells();
  drawCells();
  startBtn = document.querySelector("#startBtn");
  if (!started) {
    started = true;
    startBtn.value = "Start"
    setup();
  } else {
    started = false;
    startBtn.value = "Stop"
    createCells();
  }
}

function gamePause() {
  // pausing game
  pauseBtn = document.querySelector("#pauseBtn");
  if (!paused) {
    paused = true;
    pauseBtn.value = "Pause"
  } else {
    paused = false;
    pauseBtn.value = "UnPause"
  }
}

function setup() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  context.scale(scale, scale);
  context.fillstyle = "black";
  cells = createCells();
}

function createCells() {
  arr = new Array(resolution);
  for (let x = 0; x < resolution; x++) {
    let cols = new Array(resolution);
    for (let y = 0; y < resolution; y++) {
      cols[y] = false;
    }
    arr[x] = cols;
  }
  return arr;
}

function oddCells() {
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (Math.random() < 0.5) cells[x][y] = true;
    }
  }
}

// function evenCells() {

// }

function drawCells(oldCells, newCells) {
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (typeof(oldCells) != "undefined" && oldCells[x][y]) context.fillStyle = "black";
      else context.fillStyle = "red"
      if (cells[x][y]) context.fillRect(x, y, 1, 1);
      else {
        // if statement to check if x and y are both even or both odd else white
        if (x % 2 == 0 && y % 2 == 0) context.fillStyle = "#CCCCCC"
        else if (x % 2 != 0 && y % 2 != 0) context.fillStyle = "#CCCCCC"
        else context.fillStyle = "white";
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}

function step() {
  now = Date.now()
  delta = now - then;
  if (delta > speed) {
    then = now - (delta % speed);
    if (nextStep) {
      drawCells();
    }
  }
  let newCells = createCells();
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const neighbours = getNeighborCount(x, y);
      if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
      else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
    }
  }
  oldCells = cells;
  cells = newCells;
  drawCells(oldCells, cells);
}

function getNeighborCount(x, y) {
  let count = 0;
  for (let yy = -1; yy < 2; yy++) {
    for (let xx = -1; xx < 2; xx++) {
      if (xx === 0 && yy === 0) continue;
      if (x + xx < 0 || x + xx > resolution - 1) continue;
      if (y + yy < 0 || y + yy > resolution - 1) continue;
      if (cells[x + xx][y + yy]) {
        count++;
        if (count === 4) return 4
      }
    }
  }
  return count;
}

stepBtn.addEventListener("stepBtn", nextStep);