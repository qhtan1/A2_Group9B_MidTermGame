let world;
let player;
let gameState = "EXPLORE";
let activeTarget = null;

let bgImages = {};
let uiImages = {};

let playerSprites = {
  down: [],
  up: [],
  left: [],
  right: [],
};

// --- DEBUG OPTION ---
let showDebug = false; // 改回 false，画面更干净

// --- Hitboxes (Collision Bounds) ---
const roomObstacles = {
  Bedroom: [
    { x: 0, y: 0, w: 320, h: 75 },
    { x: 40, y: 55, w: 60, h: 65 },
    { x: 185, y: 55, w: 42, h: 35 },
    { x: 10, y: 55, w: 20, h: 30 },
    { x: 260, y: 55, w: 60, h: 40 },
  ],
  Kitchen: [
    { x: 0, y: 0, w: 320, h: 75 },
    { x: 0, y: 115, w: 130, h: 65 },
    { x: 190, y: 110, w: 40, h: 30 },
    { x: 260, y: 55, w: 60, h: 40 },
    { x: 230, y: 78, w: 20, h: 70 }, // 老奶防撞
  ],
  LivingRoom: [
    { x: 0, y: 0, w: 320, h: 75 },
    { x: 0, y: 55, w: 38, h: 110 },
    { x: 210, y: 55, w: 95, h: 40 },
    { x: 190, y: 120, w: 70, h: 30 },
    { x: 280, y: 55, w: 80, h: 120 },
  ],
  Outside: [{ x: 0, y: 0, w: 320, h: 75 }],
};

// --- Interactable Items ---
const items = [
  {
    step: 0,
    room: "Bedroom",
    x: 120,
    y: 85,
    name: "Alarm Clock",
    type: "popup",
  },
  { step: 1, room: "Bedroom", x: 210, y: 85, name: "Mirror", type: "popup" },
  {
    step: 2,
    room: "Bedroom",
    x: 160,
    y: 75,
    name: "Bedroom Door",
    type: "door",
  },
  {
    step: 3,
    room: "Kitchen",
    x: 46,
    y: 115,
    name: "Tea Canister",
    type: "popup",
  },
  {
    step: 4,
    room: "Kitchen",
    x: 160,
    y: 65,
    name: "Kitchen Door",
    type: "door",
  },
  {
    step: 5,
    room: "LivingRoom",
    x: 195,
    y: 125,
    name: "Newspaper",
    type: "popup",
  },
  {
    step: 6,
    room: "LivingRoom",
    x: 240,
    y: 90,
    name: "Partner",
    type: "popup",
  },
  {
    step: 7,
    room: "LivingRoom",
    x: 155,
    y: 65,
    name: "Main Door",
    type: "door",
  },

  // ⬇️ 拆分后的门外互动步骤 ⬇️
  {
    step: 8,
    room: "Outside",
    x: 130,
    y: 80,
    name: "Doorplate 204",
    type: "popup",
  }, // 先看门牌
  { step: 9, room: "Outside", x: 220, y: 85, name: "Neighbor", type: "popup" }, // 再和邻居互动
];

function preload() {
  bgImages.Bedroom = loadImage("assets/bg_bedroom.png");
  bgImages.Kitchen = loadImage("assets/bg_kitchen.png");
  bgImages.LivingRoom = loadImage("assets/bg_livingroom.png");
  bgImages.Outside = loadImage("assets/bg_outside.png");

  uiImages[0] = loadImage("assets/ui_clock.png");
  uiImages[1] = loadImage("assets/ui_mirror.png");
  uiImages[3] = loadImage("assets/ui_tea.png");
  uiImages[5] = loadImage("assets/ui_news.png");
  uiImages[6] = loadImage("assets/ui_partner.png");
  uiImages[8] = loadImage("assets/ui_door204.png");

  // ⬇️ 加载邻居的图片 ⬇️
  uiImages[9] = loadImage("assets/ui_neighbor.png");

  for (let i = 1; i <= 3; i++) {
    playerSprites.down.push(loadImage(`assets/Front${i}.png`));
    playerSprites.up.push(loadImage(`assets/Back${i}.png`));
    playerSprites.left.push(loadImage(`assets/Left${i}.png`));
    playerSprites.right.push(loadImage(`assets/Right${i}.png`));
  }
}

function setup() {
  let canvas = createCanvas(320, 180);
  canvas.parent("canvas-holder");
  noSmooth();

  world = new WorldLevel();
  player = new Player(150, 130, 20, 20);
}

function draw() {
  if (gameState === "EXPLORE") {
    drawBackground();

    let obstacles = roomObstacles[world.currentRoom] || [];
    player.handleMovement(obstacles, width, height);

    checkInteractions();
    player.draw();

    if (showDebug) drawDebugBoxes();
  } else if (gameState === "INTERACT") {
    drawBackground();
    player.draw();
    drawUIPopup();
  } else if (gameState === "TRANSITION") {
    background(0);
  }
}

function drawBackground() {
  let img = bgImages[world.currentRoom];
  if (img) image(img, 0, 0, width, height);
  else background("#ECE7D1");
}

function checkInteractions() {
  activeTarget = items.find(
    (i) => i.step === world.sequenceStep && i.room === world.currentRoom,
  );

  if (activeTarget) {
    let bob = sin(frameCount * 0.15) * 3;

    fill("#B97A6A");
    textAlign(CENTER);
    textSize(16);
    text("!", activeTarget.x, activeTarget.y - 20 + bob);

    if (dist(player.x, player.y, activeTarget.x, activeTarget.y) < 30) {
      document.getElementById("dialogue-text").innerText =
        "Press 'E' to interact.";
    } else {
      document.getElementById("dialogue-text").innerText =
        "Use WASD or Arrows to explore.";
    }
  }
}

function keyPressed() {
  if (keyCode === 69 && gameState === "EXPLORE" && activeTarget) {
    if (dist(player.x, player.y, activeTarget.x, activeTarget.y) < 30) {
      if (activeTarget.type === "popup") {
        gameState = "INTERACT";
        updateDialogueForStep(world.sequenceStep);
      } else {
        processSequence();
      }
    }
  }

  if (keyCode === 32 && gameState === "INTERACT") {
    processSequence();
  }
}

function drawUIPopup() {
  let img = uiImages[world.sequenceStep];
  if (img) image(img, 0, 0, width, height);

  fill(0, 0, 0, 150);
  rect(0, height - 20, width, 20);

  fill("#ECE7D1");
  textAlign(CENTER, CENTER);
  textSize(8);
  text("[ PRESS SPACE TO CLOSE ]", width / 2, height - 10);
}

function processSequence() {
  gameState = "TRANSITION";

  // ⬇️ 更新为 Step 9 (邻居对话结束后) 切入 Day 3 ⬇️
  if (world.sequenceStep === 9) {
    document.getElementById("npc-name").innerText = "System";
    document.getElementById("dialogue-text").innerText = "Walking away...";
    setTimeout(() => advanceDayToNext(), 2000);
    return;
  }

  world.advanceSequence();

  if (world.sequenceStep === 3) {
    world.changeRoom("Kitchen");
    player.x = 160;
    player.y = 80;
  } else if (world.sequenceStep === 5) {
    world.changeRoom("LivingRoom");
    player.x = 155;
    player.y = 80;
  } else if (world.sequenceStep === 8) {
    world.changeRoom("Outside");
    player.x = 160;
    player.y = 120;
  }

  setTimeout(() => {
    gameState = "EXPLORE";
    document.getElementById("npc-name").innerText = "System";
    document.getElementById("dialogue-text").innerText =
      "Use WASD or Arrows to explore.";
  }, 500);
}

function updateDialogueForStep(step) {
  let uiText = document.getElementById("dialogue-text");
  let npcName = document.getElementById("npc-name");

  if (step === 0) {
    npcName.innerText = "System";
    uiText.innerText = "7:00 AM.";
  }
  if (step === 1) {
    npcName.innerText = "System";
    uiText.innerText = "It's me.";
  }
  if (step === 3) {
    npcName.innerText = "System";
    uiText.innerText = "A familiar tea canister.";
  }
  if (step === 5) {
    npcName.innerText = "System";
    uiText.innerText = "Today's newspaper.";
  }
  if (step === 6) {
    npcName.innerText = "Partner";
    uiText.innerText = "How are you feeling today?";
  }
  if (step === 8) {
    npcName.innerText = "System";
    uiText.innerText = "Apartment 204.";
  }
  if (step === 9) {
    // ⬇️ 邻居的对话 ⬇️
    npcName.innerText = "Neighbor";
    uiText.innerText = "Good morning.";
  }
}

function advanceDayToNext() {
  document.body.style.backgroundColor = "black";
  document.getElementById("npc-name").innerText = "System";
  document.getElementById("dialogue-text").innerText =
    "Resting... The days blur together.";
}

// --- DEBUG DRAW ---
function drawDebugBoxes() {
  fill(255, 0, 0, 100);
  let obs = roomObstacles[world.currentRoom] || [];
  for (let o of obs) {
    rect(o.x, o.y, o.w, o.h);
  }
}
