let world;
let player;
let gameState = "TITLE";
let activeTarget = null;

// --- New Systems ---
let checklist;
let timerSystem;
let attentionSystem;

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

// --- ADMIN / DEV MODE ---
// Toggle with backtick (`). When OFF, no dev controls are available.
let adminMode = false;

// Room and player position lookup per sequence step
const stepRoomMap = {
  0: "Bedroom", 1: "Bedroom", 2: "Bedroom",
  3: "Kitchen", 4: "Kitchen",
  5: "LivingRoom", 6: "LivingRoom", 7: "LivingRoom",
  8: "Outside", 9: "Outside",
};
const stepPlayerPos = {
  0: { x: 150, y: 130 }, 1: { x: 150, y: 130 }, 2: { x: 150, y: 130 },
  3: { x: 160, y: 80 },  4: { x: 160, y: 80 },
  5: { x: 155, y: 80 },  6: { x: 155, y: 80 },  7: { x: 155, y: 80 },
  8: { x: 160, y: 120 }, 9: { x: 160, y: 120 },
};

/**
 * Admin: jump to any sequence step within the current day
 */
function adminJumpToStep(step) {
  step = constrain(step, 0, 9);
  world.sequenceStep = step;
  world.currentRoom = stepRoomMap[step];
  player.x = stepPlayerPos[step].x;
  player.y = stepPlayerPos[step].y;
  gameState = "EXPLORE";
  isWaitingForObservationChoice = false;
  isDistorted = false;

  const modal = document.getElementById("observation-modal");
  if (modal) modal.classList.remove("show");

  document.getElementById("npc-name").innerText = "[ADMIN]";
  document.getElementById("dialogue-text").innerText =
    `Jumped to step ${step} — ${world.currentRoom} (Day ${world.currentDay})`;
}

/**
 * Admin: jump to a specific day, resets everything
 */
function adminJumpToDay(day) {
  world.resetForNextDay(day);
  player.x = 150;
  player.y = 130;
  gameState = "EXPLORE";
  checklist.reset();
  timerSystem.reset();
  attentionSystem.reset();
  isDistorted = false;
  isWaitingForObservationChoice = false;

  const modal = document.getElementById("observation-modal");
  if (modal) modal.classList.remove("show");

  if (day === 3) timerSystem.enableDistortion();

  document.getElementById("day-display").innerText = "Day " + day;
  document.getElementById("npc-name").innerText = "[ADMIN]";
  document.getElementById("dialogue-text").innerText =
    `Jumped to Day ${day} — start of day`;
}

// --- Day 3 特殊状态变量 ---
let isDistorted = false;
let isWaitingForObservationChoice = false;

// --- Game Over animation state ---
let gameOverAlpha = 0;
let gameOverScreenShown = false;

/**
 * Handle observation choice result
 * @param {string} answer - "wrong" or "normal"
 */
function handleObservationChoice(answer) {
  console.log(`handleObservationChoice called with answer: ${answer}`);

  const step = attentionSystem.getObservationStep();
  console.log(`Observation step: ${step}`);

  // Mark this observation as answered
  attentionSystem.markObservationAnswered(step);

  // Check if answer is correct
  const isCorrect = attentionSystem.isAnswerCorrect(step, answer);
  console.log(`Answer is correct: ${isCorrect}`);

  if (isCorrect) {
    // Correct answer - continue game normally
    document.getElementById("npc-name").innerText = "System";
    document.getElementById("dialogue-text").innerText =
      "Observation complete.";
  } else {
    // Wrong answer - decrease attention
    document.getElementById("npc-name").innerText = "System";
    document.getElementById("dialogue-text").innerText =
      "That doesn't seem right...";

    let levelChanged = attentionSystem.decrease(34);
    console.log(
      `Attention level changed: ${levelChanged}, new level: ${attentionSystem.getLevel()}`,
    );
    if (levelChanged) {
      let msg = attentionSystem.getWarningMessage(attentionSystem.getLevel());
      setTimeout(() => {
        document.getElementById("dialogue-text").innerText = msg;
      }, 500);
    }
  }

  attentionSystem.dismissObservationUI();
  isWaitingForObservationChoice = false;

  // Continue to next sequence step after a brief delay
  setTimeout(() => {
    processSequence();
  }, 1000);
}

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

  // Initialize new systems
  checklist = new ChecklistManager();
  timerSystem = new TimerSystem();
  attentionSystem = new AttentionSystem();

}

function draw() {
  // --- Persistent clarity effects (scale 0–1, where 0 = no clarity left) ---
  let clarityRatio = attentionSystem.currentAttention / attentionSystem.maxAttention;
  let persistBlur   = map(clarityRatio, 1, 0, 0, 4);   // 0 → 4 px as clarity drops
  let tempBlur      = attentionSystem.getBlurAmount() * 3;
  let totalBlur     = persistBlur + tempBlur;

  // Apply combined blur BEFORE drawing game content
  if (totalBlur > 0) {
    drawingContext.filter = `blur(${totalBlur}px)`;
  }

  // Day 3 clarity ratio passed to player for glitch + speed effects
  let day3Clarity = (world.currentDay === 3) ? clarityRatio : 1;

  if (gameState === "TITLE") {
    background(13);
    drawingContext.filter = "none";
    return;
  }

  if (gameState === "EXPLORE") {
    drawBackground();

    let obstacles = roomObstacles[world.currentRoom] || [];
    player.handleMovement(obstacles, width, height, day3Clarity);

    checkInteractions();
    player.draw(day3Clarity);

    if (showDebug) drawDebugBoxes();
  } else if (gameState === "INTERACT") {
    drawBackground();
    player.draw(day3Clarity);
    drawUIPopup();
  } else if (gameState === "TRANSITION") {
    background(0);
  } else if (gameState === "GAME_OVER") {
    // Draw shaking scene that collapses into black
    let shake = map(gameOverAlpha, 0, 255, 10, 0);
    push();
    translate(random(-shake, shake), random(-shake, shake));
    drawBackground();
    player.draw(day3Clarity);
    pop();

    // Gradually fade to black
    gameOverAlpha = min(255, gameOverAlpha + 2.5);
    fill(0, 0, 0, gameOverAlpha);
    noStroke();
    rect(0, 0, width, height);

    // Once fully black, show HTML overlay
    if (gameOverAlpha >= 255) {
      showGameOverScreen();
    }
    drawingContext.filter = "none";
    return; // skip UI overlays during collapse
  }

  // Reset blur so UI panels stay crisp
  drawingContext.filter = "none";

  // Persistent darkness overlay on the game canvas (beneath UI panels)
  let darkAlpha = map(clarityRatio, 1, 0, 0, 100);
  if (darkAlpha > 0) {
    fill(0, 0, 0, darkAlpha);
    noStroke();
    rect(0, 0, width, height);
  }

  // Update all systems
  timerSystem.update();
  attentionSystem.update();

  // Draw UI overlays (on top of game canvas)
  push();
  scale(width / 320, height / 180);

  // Draw timer (top-left)
  if (timerSystem.getIsActive()) {
    timerSystem.draw();
  }

  // Draw checklist (left side) - always visible
  checklist.draw();

  // Draw attention system (top-right)
  attentionSystem.draw();

  // Draw admin mode overlay
  if (adminMode) {
    drawAdminOverlay();
  }

  pop();

  // Check if 7:45 deadline passed — only fatal if player hasn't left the apartment
  if (timerSystem.hasExpired() && gameState !== "GAME_OVER") {
    if (world.sequenceStep < 8) {
      handleGameOver("time");
    }
  }

  // Check if attention is depleted
  if (attentionSystem.currentAttention <= 0 && gameState !== "GAME_OVER") {
    handleGameOver("attention");
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
    let distance = dist(player.x, player.y, activeTarget.x, activeTarget.y);

    if (distance < 45) {
      document.getElementById("dialogue-text").innerText =
        "Press 'E' to interact.";
    } else {
      document.getElementById("dialogue-text").innerText =
        "Use WASD or Arrows to explore.";
    }
  }
}

function drawAdminOverlay() {
  // Red badge in bottom-right corner of the canvas
  let badgeX = 260;
  let badgeY = 165;

  fill(200, 30, 30, 220);
  noStroke();
  rect(badgeX, badgeY, 58, 13, 2);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(6);
  text("ADMIN  ` toggle", badgeX + 3, badgeY + 2);

  // Hint bar at bottom of canvas
  fill(0, 0, 0, 160);
  rect(0, 155, 260, 13);

  fill(255, 220, 100);
  textAlign(LEFT, TOP);
  textSize(6);
  text("[ prev step   ] next step   1 Day1   3 Day3", 4, 158);
}

function keyPressed() {
  // Title screen — Enter or Space to start
  if (gameState === "TITLE" && (keyCode === ENTER || keyCode === 32)) {
    startGame();
    return;
  }

  // --- ADMIN TOGGLE: backtick (`) ---
  if (keyCode === 192) {
    adminMode = !adminMode;
    document.getElementById("npc-name").innerText = "[ADMIN]";
    document.getElementById("dialogue-text").innerText =
      adminMode
        ? "Admin mode ON — [ prev step, ] next step, 1 = Day 1, 3 = Day 3"
        : "Admin mode OFF";
    return;
  }

  // --- ADMIN CONTROLS (only when admin mode is active) ---
  if (adminMode) {
    // [ = go back one step
    if (keyCode === 219) {
      adminJumpToStep(world.sequenceStep - 1);
      return;
    }
    // ] = go forward one step
    if (keyCode === 221) {
      adminJumpToStep(world.sequenceStep + 1);
      return;
    }
    // 1 = jump to Day 1
    if (keyCode === 49 && gameState !== "INTERACT") {
      adminJumpToDay(1);
      return;
    }
    // 3 = jump to Day 3
    if (keyCode === 51 && gameState !== "INTERACT") {
      adminJumpToDay(3);
      return;
    }
  }

  // Handle game over restart
  if (gameState === "GAME_OVER" && keyCode === 82) {
    restartGame();
    return;
  }

  if (keyCode === 69 && gameState === "EXPLORE" && activeTarget) {
    if (dist(player.x, player.y, activeTarget.x, activeTarget.y) < 45) {
      if (activeTarget.type === "popup") {
        gameState = "INTERACT";

        // Start timer on first interaction (alarm clock)
        if (world.sequenceStep === 0) {
          timerSystem.start();
        }

        // Mark task as complete
        checklist.markTaskComplete(world.sequenceStep);

        // Check if this step requires observation (Day 3 only)
        if (world.currentDay === 3 && attentionSystem.triggerObservationUI(world.sequenceStep)) {
          isWaitingForObservationChoice = true;
        }

        updateDialogueForStep(world.sequenceStep);
      } else {
        // Door interaction
        if (!checklist.canLeaveApartment() && world.sequenceStep === 7) {
          // Not enough tasks completed - prevent door transition
          document.getElementById("npc-name").innerText = "System";
          document.getElementById("dialogue-text").innerText =
            `Complete at least ${checklist.minTasksRequired} tasks before leaving. (${checklist.getCompletedCount()}/${checklist.minTasksRequired})`;
          return;
        }

        processSequence();
      }
    }
  }

  if (gameState === "INTERACT") {
    // Observation choice for Day 3 (steps 0, 5, 8)
    if (isWaitingForObservationChoice) {
      if (keyCode === 49) {
        handleObservationChoice("wrong");
      } else if (keyCode === 50) {
        handleObservationChoice("normal");
      }
      return;
    }

    // Normal space key to close
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

  // Draw 7:45 alarm mark on clock popup (both Day 1 and Day 3)
  // Minute hand at 45 min points to the "9" position (left side of clock face)
  // Adjust clockCX/clockCY/clockR if the clock image layout differs
  if (world.sequenceStep === 0) {
    const clockCX = 160; // estimated clock center x
    const clockCY = 82;  // estimated clock center y
    const clockR  = 42;  // radius to the number ring
    // "7" on a clock face = 210° from top, clockwise
    // In p5 coords (east = 0°): subtract 90° → 120°
    const angle = radians(120);
    const markX = clockCX + clockR * cos(angle);
    const markY = clockCY + clockR * sin(angle);
    push();
    fill(210, 30, 30);
    noStroke();
    ellipse(markX, markY, 8, 8); // red dot near the "7"
    pop();
  }

  fill(0, 0, 0, 150);
  rect(0, height - 20, width, 20);
  fill("#ECE7D1");
  textAlign(CENTER, CENTER);
  textSize(8);

  if (isWaitingForObservationChoice) {
    text("[ 1: Something is wrong   |   2: Looks normal ]", width / 2, height - 10);
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
    timerSystem.stop(); // made it outside in time
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
      uiText.innerText = "7:00 AM. I need to leave before 7:45 am for groceries.";
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
      uiText.innerText = "7:00... I need to leave before 7:45 am for groceries.";
    }
    if (step === 1) {
      npcName.innerText = "System";
      uiText.innerText = "I don't recognize... No, it's me. Who else?";
    }
    if (step === 3) {
      npcName.innerText = "System";
      uiText.innerText = "The tea tin... it looks the same as always.";
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

        // Reset systems for new day
        checklist.reset();
        timerSystem.reset();
        if (world.currentDay === 3) {
          console.log("✓ DAY 3 STARTED - Enabling timer distortion");
          timerSystem.enableDistortion();
        }
        attentionSystem.reset();

        // Update HTML day display
        document.getElementById("day-display").innerText = "Day 3";

        document.getElementById("npc-name").innerText = "System";
        document.getElementById("dialogue-text").innerText =
          "Use WASD to explore.";
      }, 1500);
    }, 2000);
  }, 2500);
}

/**
 * Handle game over conditions (time expiration or attention depleted)
 * @param {string} reason - "time" or "attention"
 */
function handleGameOver(_reason) {
  if (gameState === "GAME_OVER") return;
  gameState = "GAME_OVER";
  gameOverAlpha = 0;
  gameOverScreenShown = false;
  player.velocityX = 0;
  player.velocityY = 0;
  isWaitingForObservationChoice = false;
  attentionSystem.dismissObservationUI();
}

/**
 * Show the HTML game-over overlay once the canvas has faded to black
 */
function showGameOverScreen() {
  if (gameOverScreenShown) return;
  gameOverScreenShown = true;
  document.getElementById("game-over-screen").classList.add("show");
}

/**
 * Start game from title screen (called by Start button and Enter key)
 */
function startGame() {
  const titleScreen = document.getElementById("title-screen");
  titleScreen.classList.remove("show");
  titleScreen.classList.add("hide");
  document.getElementById("main-container").style.display = "block";
  gameState = "EXPLORE";
}

/**
 * Restart the game from Day 1 (called by the Restart button and R key)
 */
function restartGame() {
  gameOverAlpha = 0;
  gameOverScreenShown = false;
  document.getElementById("game-over-screen").classList.remove("show");

  world.resetForNextDay(1);
  player.x = 150;
  player.y = 130;
  gameState = "EXPLORE";
  checklist.reset();
  timerSystem.reset();
  attentionSystem.reset();
  isDistorted = false;
  isWaitingForObservationChoice = false;

  document.getElementById("day-display").innerText = "Day 1";
  document.getElementById("npc-name").innerText = "System";
  document.getElementById("dialogue-text").innerText =
    "Use WASD or Arrows to move. Approach objects and press 'E'.";
}

// --- Music Control ---
let musicPlaying = false;

function toggleMusic() {
  const music = document.getElementById("bg-music");
  const btn = document.getElementById("music-btn");
  if (musicPlaying) {
    music.pause();
    btn.textContent = "♪";
    btn.classList.add("muted");
    musicPlaying = false;
  } else {
    music.play();
    btn.textContent = "♫";
    btn.classList.remove("muted");
    musicPlaying = true;
  }
}

// --- DEBUG DRAW ---
function drawDebugBoxes() {
  fill(255, 0, 0, 100);
  let obs = roomObstacles[world.currentRoom] || [];
  for (let o of obs) {
    rect(o.x, o.y, o.w, o.h);
  }
}
