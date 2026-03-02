let world;
let player;
let gameState = "EXPLORE";
let activeTarget = null;

let bgImages = {};
let uiImages = {};

// --- 经过截图校准的精确碰撞箱 (Hitboxes) ---
const roomObstacles = {
  Bedroom: [
    { x: 0, y: 0, w: 320, h: 70 }, // 上方墙壁：减薄高度，让玩家能碰到门
    { x: 40, y: 55, w: 60, h: 65 }, // 床：向下微调，留出上方通道
    { x: 185, y: 55, w: 42, h: 35 }, // 镜子桌：缩小范围
    { x: 10, y: 55, w: 20, h: 30 }, // 钟：减小范围
    { x: 260, y: 55, w: 60, h: 40 }, // 右侧书架：向右移动，空出走廊
  ],
  Kitchen: [
    { x: 0, y: 0, w: 320, h: 55 }, // 顶部橱柜：减薄，防止卡住头
    { x: 0, y: 115, w: 130, h: 65 }, // 左侧岛台：向下移动
    { x: 190, y: 110, w: 40, h: 30 }, // 餐桌：向左微调并缩小
    { x: 260, y: 55, w: 60, h: 50 }, // 右侧高柜
  ],
  LivingRoom: [
    { x: 0, y: 0, w: 160, h: 60 }, // 左侧墙壁长柜
    { x: 220, y: 65, w: 100, h: 115 }, // 右侧大沙发
    { x: 175, y: 115, w: 50, h: 30 }, // 咖啡桌
  ],
  Outside: [
    { x: 0, y: 0, w: 320, h: 75 }, // 走廊上方墙壁
  ],
};

// --- Day 1 Interactables ---
const items = [
  {
    step: 0,
    room: "Bedroom",
    x: 113,
    y: 71,
    name: "Alarm Clock",
    type: "popup",
  },
  { step: 1, room: "Bedroom", x: 199, y: 66, name: "Mirror", type: "popup" },
  {
    step: 2,
    room: "Bedroom",
    x: 160,
    y: 65,
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
    room: "LivingRoom",
    x: 195,
    y: 125,
    name: "Newspaper",
    type: "popup",
  },
  {
    step: 5,
    room: "LivingRoom",
    x: 155,
    y: 65,
    name: "Main Door",
    type: "door",
  },
  {
    step: 6,
    room: "Outside",
    x: 160,
    y: 80,
    name: "Doorplate 204",
    type: "popup",
  },
];

let showDebug = true; // Set to false to hide hitbox overlays

function preload() {
  bgImages.Bedroom = loadImage("assets/bg_bedroom.png");
  bgImages.Kitchen = loadImage("assets/bg_kitchen.png");
  bgImages.LivingRoom = loadImage("assets/bg_livingroom.png");
  bgImages.Outside = loadImage("assets/bg_outside.png");

  uiImages[0] = loadImage("assets/ui_clock.png");
  uiImages[1] = loadImage("assets/ui_mirror.png");
  uiImages[3] = loadImage("assets/ui_tea.png");
  uiImages[4] = loadImage("assets/ui_news.png");
  uiImages[6] = loadImage("assets/ui_door204.png");
}

function setup() {
  let canvas = createCanvas(320, 180);
  canvas.parent("canvas-holder");
  noSmooth();

  world = new WorldLevel();
  // Safe spawn location in Bedroom
  player = new Player(150, 130, 20, 20);
}

function draw() {
  if (gameState === "EXPLORE") {
    drawBackground();

    let obstacles = roomObstacles[world.currentRoom] || [];
    player.handleMovement(obstacles, width, height);

    handleRoomTransitions();
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
  if (img) {
    image(img, 0, 0, width, height);
  } else {
    background("#ECE7D1");
  }
}

// Seamless cross-room boundaries with updated safe-spawn Y coordinates
function handleRoomTransitions() {
  if (world.currentRoom === "Kitchen" && player.x >= width - player.w) {
    world.changeRoom("LivingRoom");
    player.x = 5;
    player.y = 150; // Safely below the coffee table
  } else if (world.currentRoom === "LivingRoom" && player.x <= 0) {
    world.changeRoom("Kitchen");
    player.x = width - player.w - 5;
    player.y = 150; // Safely below the right kitchen cabinet
  }
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
        `Press 'E' to interact.`;
    } else {
      document.getElementById("dialogue-text").innerText =
        "Use WASD or Arrows to explore. Follow the '!'.";
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
  if (img) {
    image(img, 0, 0, width, height);
  }

  fill(0, 0, 0, 150);
  rect(0, height - 20, width, 20);
  fill("#ECE7D1");
  textAlign(CENTER, CENTER);
  textSize(8);
  text("[ PRESS SPACE TO CLOSE ]", width / 2, height - 10);
}

function processSequence() {
  gameState = "TRANSITION";
  world.advanceSequence();

  // Updated safe-spawn coordinates when walking through physical doors
  if (world.sequenceStep === 3) {
    world.changeRoom("Kitchen");
    player.x = 160;
    player.y = 80; // Safe hallway between cabinets and island
  } else if (world.sequenceStep === 6) {
    world.changeRoom("Outside");
    player.x = 160;
    player.y = 100; // Safe hallway outside the doors
  }

  setTimeout(() => {
    gameState = "EXPLORE";
    document.getElementById("npc-name").innerText = "System";
    document.getElementById("dialogue-text").innerText =
      "Use WASD or Arrows to explore.";

    if (world.sequenceStep === 7) {
      document.getElementById("dialogue-text").innerText =
        "Day 1 Complete. Preparing Day 3...";
      gameState = "TRANSITION";
    }
  }, 500);
}

function updateDialogueForStep(step) {
  let uiText = document.getElementById("dialogue-text");
  let npcName = document.getElementById("npc-name");

  if (step === 3) {
    npcName.innerText = "Emma";
    uiText.innerText = "Good morning.";
  } else if (step === 4) {
    npcName.innerText = "Emma";
    uiText.innerText = "How are you feeling today?";
  } else if (step === 6) {
    npcName.innerText = "Neighbor";
    uiText.innerText = "Good morning.";
  }
}

function drawDebugBoxes() {
  fill(255, 0, 0, 100);
  let obs = roomObstacles[world.currentRoom] || [];
  for (let o of obs) rect(o.x, o.y, o.w, o.h);
}
