let world;
let player;
let gameState = "EXPLORE";
let activeTarget = null;

let bgImages = {};

// 嵌套对象，区分 Day 1 和 Day 3 的图片
let uiImages = {
  day1: {},
  day3: {},
};

let playerSprites = {
  down: [],
  up: [],
  left: [],
  right: [],
};

// --- DEBUG OPTION ---
let showDebug = false;

// --- Day 3 特殊状态变量 ---
let teaChoiceMade = false;
let isDistorted = false;

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

    { x: 0, y: 75, w: 28, h: 40 },
    // --- 岛台 ---
    { x: 0, y: 115, w: 130, h: 65 },
    // --- 桌子 ---
    { x: 190, y: 110, w: 40, h: 30 },
    // --- 大柜子下半部分 ---
    { x: 260, y: 55, w: 60, h: 40 },
    // --- 左边椅子 ---
    { x: 165, y: 110, w: 25, h: 40 },
    // --- 右边椅子 ---
    { x: 230, y: 110, w: 25, h: 40 },
  ],
  LivingRoom: [
    { x: 0, y: 0, w: 320, h: 75 },
    { x: 0, y: 55, w: 38, h: 140 },
    { x: 210, y: 55, w: 95, h: 35 },
    { x: 185, y: 115, w: 70, h: 30 },
    { x: 280, y: 55, w: 80, h: 120 },
  ],
  Outside: [{ x: 0, y: 0, w: 320, h: 60 }],
};

// --- Interactable Items ---
const items = [
  {
    step: 0,
    room: "Bedroom",
    x: 113,
    y: 70,
    name: "Alarm Clock",
    type: "popup",
  },
  { step: 1, room: "Bedroom", x: 200, y: 64, name: "Mirror", type: "popup" },
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
    x: 257,
    y: 95,
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
  {
    step: 8,
    room: "Outside",
    x: 155,
    y: 55,
    name: "Doorplate 204",
    type: "popup",
  },
  { step: 9, room: "Outside", x: 220, y: 50, name: "Neighbor", type: "popup" },
];

function preload() {
  bgImages.Bedroom = loadImage("assets/bg_bedroom.png");
  bgImages.Kitchen = loadImage("assets/bg_kitchen.png");
  bgImages.LivingRoom = loadImage("assets/bg_livingroom.png");
  bgImages.Outside = loadImage("assets/bg_outside.jpg");

  // --- Day 1 图片 ---
  uiImages.day1[0] = loadImage("assets/ui_clock.png");
  uiImages.day1[1] = loadImage("assets/ui_mirror.png");
  uiImages.day1[3] = loadImage("assets/ui_tea.png");
  uiImages.day1[5] = loadImage("assets/ui_news.png");
  uiImages.day1[6] = loadImage("assets/ui_partner.png");
  uiImages.day1[8] = loadImage("assets/ui_door204.png");
  uiImages.day1[9] = loadImage("assets/ui_neighbor.png");

  // --- Day 3 图片 ---
  uiImages.day3[0] = loadImage("assets/ui_clock_day3.png"); // 模糊闹钟
  uiImages.day3[1] = loadImage("assets/ui_mirror_day3.png"); // 老爷爷照镜子全屏图
  uiImages.day3[3] = loadImage("assets/ui_tea_day3.png");
  uiImages.day3[5] = loadImage("assets/ui_news_day3.png");
  uiImages.day3[6] = loadImage("assets/ui_partner.png");
  uiImages.day3[8] = loadImage("assets/ui_door204_day3.png");
  uiImages.day3[9] = loadImage("assets/ui_neighbor.png");

  // 🚨 注意这里的后缀全部改成了大写 .PNG 🚨
  for (let i = 1; i <= 3; i++) {
    playerSprites.down.push(loadImage(`assets/Front${i}.PNG`));
    playerSprites.up.push(loadImage(`assets/Back${i}.PNG`));
    playerSprites.left.push(loadImage(`assets/Left${i}.PNG`));
    playerSprites.right.push(loadImage(`assets/Right${i}.PNG`));
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

    fill("#FF0000");
    textAlign(CENTER);
    textSize(20);
    text("!", activeTarget.x, activeTarget.y - 20 + bob);

    if (dist(player.x, player.y, activeTarget.x, activeTarget.y) < 45) {
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
    if (dist(player.x, player.y, activeTarget.x, activeTarget.y) < 45) {
      if (activeTarget.type === "popup") {
        gameState = "INTERACT";
        // 重置茶罐选择状态
        if (world.currentDay === 3 && world.sequenceStep === 3) {
          teaChoiceMade = false;
          isDistorted = false;
        }
        updateDialogueForStep(world.sequenceStep);
      } else {
        processSequence();
      }
    }
  }

  if (gameState === "INTERACT") {
    // 茶罐的分支选择拦截
    if (world.currentDay === 3 && world.sequenceStep === 3 && !teaChoiceMade) {
      if (keyCode === 49) {
        // 1: It's fine
        teaChoiceMade = true;
        processSequence();
      } else if (keyCode === 50) {
        // 2: Look closer
        teaChoiceMade = true;
        isDistorted = true; // 开启抖动
        document.getElementById("dialogue-text").innerText =
          "It's... hard to focus...";
        setTimeout(() => {
          isDistorted = false;
          processSequence();
        }, 1500);
      }
      return;
    }

    // 常规空格键关闭
    if (keyCode === 32) {
      processSequence();
    }
  }
}

function drawUIPopup() {
  let dayKey = "day" + world.currentDay;
  let img = uiImages[dayKey][world.sequenceStep];

  push();

  // 茶罐抖动效果保持
  if (isDistorted) {
    translate(random(-4, 4), random(-4, 4));
    tint(255, random(180, 255));
  }

  if (img) image(img, 0, 0, width, height); // 完美全图覆盖
  pop();

  fill(0, 0, 0, 150);
  rect(0, height - 20, width, 20);
  fill("#ECE7D1");
  textAlign(CENTER, CENTER);
  textSize(8);

  if (world.currentDay === 3 && world.sequenceStep === 3 && !teaChoiceMade) {
    text("[ 1: It's fine   |   2: Look closer ]", width / 2, height - 10);
  } else {
    text("[ PRESS SPACE TO CLOSE ]", width / 2, height - 10);
  }
}

function processSequence() {
  gameState = "TRANSITION";

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

    if (world.currentDay === 3 && world.sequenceStep === 4) {
      document.getElementById("npc-name").innerText = "Partner";
      document.getElementById("dialogue-text").innerText =
        "You've always had this one.";
    } else {
      document.getElementById("npc-name").innerText = "System";
      document.getElementById("dialogue-text").innerText =
        "Use WASD or Arrows to explore.";
    }
  }, 500);
}

function updateDialogueForStep(step) {
  let uiText = document.getElementById("dialogue-text");
  let npcName = document.getElementById("npc-name");

  if (world.currentDay === 1) {
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
      npcName.innerText = "Neighbor";
      uiText.innerText = "Good morning.";
    }
  } else if (world.currentDay === 3) {
    if (step === 0) {
      npcName.innerText = "System";
      uiText.innerText = "7:00... No, 7:0... I can't read the minutes.";
    }
    if (step === 1) {
      npcName.innerText = "System";
      uiText.innerText = "I don't recognize... No, it's me. Who else?";
    }
    if (step === 3) {
      npcName.innerText = "System";
      uiText.innerText =
        "The label looks weird. \n[Press 1] It's fine.  [Press 2] Look closer.";
    }
    if (step === 5) {
      npcName.innerText = "System";
      uiText.innerText = "The letters are... shifting.";
    }
    if (step === 6) {
      npcName.innerText = "Partner";
      uiText.innerText = "Is there anything in the news?";
    }
    if (step === 8) {
      npcName.innerText = "System";
      uiText.innerText = "Apartment... 20?";
    }
    if (step === 9) {
      npcName.innerText = "Neighbor";
      uiText.innerText = "Your apartment has always been 204.";
    }
  }
}

// 🚨 使用了你刚刚要求更新的版本 🚨
function advanceDayToNext() {
  document.body.style.backgroundColor = "black";
  document.getElementById("npc-name").innerText = "System";
  document.getElementById("dialogue-text").innerText =
    "Resting... The days blur together.";

  setTimeout(() => {
    document.getElementById("dialogue-text").innerText = "Waking up...";

    setTimeout(() => {
      document.getElementById("dialogue-text").innerText = "Day 3.";

      setTimeout(() => {
        document.body.style.backgroundColor = "";
        world.resetForNextDay(3);
        player.x = 150;
        player.y = 130;
        gameState = "EXPLORE";

        // 🚨 更新 HTML 里的顶部标题 🚨
        document.getElementById("day-display").innerText = "Day 3";

        document.getElementById("npc-name").innerText = "System";
        document.getElementById("dialogue-text").innerText =
          "Use WASD to explore.";
      }, 1500);
    }, 2000);
  }, 2500);
}

// --- DEBUG DRAW ---
function drawDebugBoxes() {
  fill(255, 0, 0, 100);
  let obs = roomObstacles[world.currentRoom] || [];
  for (let o of obs) {
    rect(o.x, o.y, o.w, o.h);
  }
}
