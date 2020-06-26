let canvas; // = document.getElementById("canvas");
let context; // = canvas.getContext("2d");
let arr; // new Array(resolution);
const size = 800;
const scale = 8;
let cellsPerRow;
let cellsPerColumn;
let pixelsPerCell;
let started = false;
let paused = false;
let startBtn;
let cellsSaved;
let pauseBtn;
let speedPercentage = 100;

//let controllingInterval;


function startGame() {
  // starting and restarting the game
  getSpeedFromSlider();
  let gridWidth = size / scale;
  let gridHeight = size / scale;
  initializeCanvas();
  let cells = createCells(gridWidth, gridHeight);
  cells = randomizeCells(cells);
  startBtn = document.querySelector("#startBtn");
  if (!started) {
    started = true;
    startBtn.value = "Stop"
    runSteps(cells);
    //controllingInterval = setInterval(step, 50);
  } else {
    started = false;
    startBtn.value = "Start"
    //clearInterval(controllingInterval);
    cells = doStep(cells);
  }
  refreshSpeedDisplay();
}

function runSteps(cells) {
  if (started && !paused) {
    cells = doStep(cells);
    setTimeout(function () {cellsSaved = runSteps(cells)}, translateSpeedPercentageToMs(speedPercentage));
  } else if (paused) {
  }
  return cells;
}

function refreshSpeedDisplay() {
  document.getElementById("speedDisplay").textContent = speedPercentage + "%";
}

function moreSpeed() {
  speedPercentage = Math.min(100, speedPercentage + 1);
  refreshSpeedDisplay();
}

function lessSpeed() {
  speedPercentage = Math.max(1, speedPercentage - 1);
  refreshSpeedDisplay();
}

function getSpeedFromSlider() {
  speedPercentage = document.getElementById("speedSlider").value;
  refreshSpeedDisplay();
}

function translateSpeedPercentageToMs (percentage) {
  // 100 percent returns zero
  // 1 percent returns 1000
  let steps = 100 - percentage;
  let speed = steps * 10;
  return Math.ceil(speed);
}

function gamePause() {
  // pausing game
  pauseBtn = document.querySelector("#pauseBtn");
  if (!paused) {
    paused = true;
    pauseBtn.value = "Unpause"
  } else {
    paused = false;
    pauseBtn.value = "Pause"
    runSteps(cellsSaved);
  }
}

function initializeCanvas() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  context.scale(scale, scale);
  context.fillstyle = "black";
}

function createCells(gridWidth, gridHeight) {
  arr = new Array(gridWidth);
  for (let x = 0; x < gridWidth; x++) {
    let cols = new Array(gridHeight);
    for (let y = 0; y < gridHeight; y++) {
      cols[y] = false;
    }
    arr[x] = cols;
  }
  return arr;
}

function randomizeCells(cells) {
  for (let y = 0; y < cells[0].length; y++) {
    for (let x = 0; x < cells.length; x++) {
      if (Math.random() < 0.5) cells[x][y] = true;
    }
  }
  return cells;
}

function drawCells(oldCells, newCells) {
  let gridWidth = newCells.length;
  let gridHeight = newCells[0].length;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (typeof(oldCells) != "undefined" && oldCells[x][y]) context.fillStyle = "black";
      else context.fillStyle = "red"
      if (newCells[x][y]) context.fillRect(x, y, 1, 1);
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

function doStep(cells) {
  let isFromButton = false;
  let gridWidth;
  let gridHeight; 
  if (typeof(cells) == 'undefined') {
    //we did this step from clicking the step button
    cells = cellsSaved;
    isFromButton = true;
  }
  gridWidth = cells.length;
  gridHeight = cells[0].length;
  let newCells = createCells(gridWidth, gridHeight);
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const neighbours = getNeighborCount(cells, x, y);
      if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
      else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
    }
  }
  oldCells = cells;
  cells = newCells;
  drawCells(oldCells, cells);
  if (isFromButton) cellsSaved = newCells;
  else return newCells;
}

function getNeighborCount(cells, x, y) {
  let gridWidth = cells.length;
  let gridHeight = cells[0].length;
  let count = 0;
  for (let yy = -1; yy < 2; yy++) {
    for (let xx = -1; xx < 2; xx++) {
      if (xx === 0 && yy === 0) continue;
      if (x + xx < 0 || x + xx > gridWidth - 1) continue;
      if (y + yy < 0 || y + yy > gridHeight - 1) continue;
      if (cells[x + xx][y + yy]) {
        count++;
        if (count === 4) return 4
      }
    }
  }
  return count;
}
