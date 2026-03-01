const VIEW_W = 800;
const VIEW_H = 480;

let allLevelsData;
let levelIndex = 0;

let level;
let player;
let cam;

let collectedCount = 0;
let finalFormed = false;
let showSkyLetters = true;
let cinematicTimer = 0;

function preload() {
  allLevelsData = loadJSON("levels.json");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("Georgia");
  cam = new Camera2D(width, height);
  loadLevel(levelIndex);
}

function loadLevel(i) {
  level = LevelLoader.fromLevelsJson(allLevelsData, i);

  player = new BlobPlayer();
  player.spawnFromLevel(level);

  cam.x = player.x - width / 2;
  cam.y = 0;
  cam.clampToWorld(level.w, level.h);

  collectedCount = 0;
  finalFormed = false;
  showSkyLetters = true;
  cinematicTimer = 0;

  assignSkyPositions();
}

function draw() {
  if (!finalFormed) {
    player.update(level);
  }

  for (let l of level.letters) {
    if (l.tryCollect(player)) {
      collectedCount++;
    }
    l.update();
  }

  if (player.y - player.r > level.deathY) {
    loadLevel(levelIndex);
    return;
  }

  cam.followSideScrollerX(player.x, level.camLerp);
  cam.clampToWorld(level.w, level.h);

  drawGradientBackground();

  cam.begin();
  level.drawWorld();
  player.draw(level.theme.blob);
  for (let l of level.letters) l.drawWorld();
  cam.end();

  if (showSkyLetters) {
    for (let l of level.letters) l.drawSky();
  }

  if (collectedCount === level.letters.length && !finalFormed) {
    triggerFinalSequence();
  }

  if (finalFormed) {
    cinematicTimer++;
    drawFinalWord();
  }

  drawInstructions();
}

function triggerFinalSequence() {
  finalFormed = true;
  showSkyLetters = false; // clear individual letters
}

function drawGradientBackground() {
  const top = color(level.theme.bgTop);
  const bottom = color(level.theme.bgBottom);

  for (let y = 0; y < height; y++) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(top, bottom, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function assignSkyPositions() {
  const total = level.letters.length;
  const spacing = width / (total + 1);

  for (let i = 0; i < total; i++) {
    level.letters[i].skyX = spacing * (i + 1);
    level.letters[i].skyY = 100;
  }
}

function drawFinalWord() {
  push();
  textAlign(CENTER, CENTER);
  textSize(80);

  let fade = min(cinematicTimer * 5, 255);
  fill(255, fade);

  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = "rgba(255,255,255,1)";

  text("COURAGE", width / 2, height / 2);

  drawingContext.shadowBlur = 0;
  pop();
}

function drawInstructions() {
  push();
  fill(255, 180);
  textSize(14);
  textAlign(LEFT);

  text("Move: A/D or ← →", 20, 30);
  text("Jump: W / ↑ / Space", 20, 48);
  text("Collect letters to form a word.", 20, 66);

  pop();
}

function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.tryJump();
  }
  if (key === "r" || key === "R") loadLevel(levelIndex);
}
