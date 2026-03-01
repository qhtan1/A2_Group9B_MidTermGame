let world;
// Player moves in X and Y now
let player = { x: 80, y: 70, w: 10, h: 10 };
let gameState = "EXPLORE"; // Can be EXPLORE or INTERACT
let currentInteraction = null;

function setup() {
  // Classic Gameboy Resolution (160x144)
  let canvas = createCanvas(160, 144);
  canvas.parent("canvas-holder");
  noSmooth();

  world = new WorldLevel();
}

function draw() {
  if (gameState === "EXPLORE") {
    drawTopDownRoom();
    handleMovement();
    checkInteractions();
    drawPlayer();
  } else if (gameState === "INTERACT") {
    drawCloseUpItem();
  }
}

function drawTopDownRoom() {
  background("#ECE7D1"); // Floor (Light Cream)

  fill("#8E977D"); // Wall color
  rect(0, 0, width, 20); // Top wall

  if (world.getCurrentRoom() === "LivingRoom") {
    // Couch
    fill("#DBCEA5");
    rect(10, 30, 80, 20);

    // Table with Bowl
    fill("#8A7650");
    rect(100, 60, 40, 30);
    fill("#ECE7D1"); // The bowl
    ellipse(120, 75, 12, 12);
  } else if (world.getCurrentRoom() === "Bathroom") {
    // Sink
    fill("#8A7650");
    rect(110, 20, 30, 20);
    // Tub
    fill("#DBCEA5");
    rect(30, 90, 40, 20);
  }
}

function drawPlayer() {
  fill("#2E2E2E"); // Dark player character
  noStroke();
  rect(player.x, player.y, player.w, player.h);
}

function handleMovement() {
  let speed = 1.5;
  if (keyIsDown(UP_ARROW)) player.y -= speed;
  if (keyIsDown(DOWN_ARROW)) player.y += speed;
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;

  // Constrain to top wall and bottom floor
  player.y = constrain(player.y, 20, height - player.h);

  // Room switching
  let newPos = world.checkDoorways(player.x, player.y, width, height);
  player.x = newPos.x;
  player.y = newPos.y;
}

function checkInteractions() {
  // Check if player is near the table in the Living Room
  if (world.getCurrentRoom() === "LivingRoom") {
    let distToTable = dist(player.x, player.y, 120, 75);

    if (distToTable < 20) {
      document.getElementById("dialogue-text").innerText =
        "Walk into the table to eat.";

      // If they physically touch the table, trigger interaction
      if (distToTable < 10) {
        triggerInteraction("BOWL");
      }
    } else {
      document.getElementById("dialogue-text").innerText =
        "Use Arrow Keys to explore.";
    }
  }
}

// --- INTERACTION SYSTEM ---

function triggerInteraction(itemName) {
  gameState = "INTERACT";
  currentInteraction = itemName;

  // Update HTML UI
  document.getElementById("dialogue-text").innerText = "Eat food?";
  document.getElementById("options-container").style.display = "flex";
}

function drawCloseUpItem() {
  background("#ECE7D1");

  if (currentInteraction === "BOWL") {
    // Draw the giant pixel bowl
    fill("#8E977D");
    arc(80, 72, 120, 80, 0, PI); // Bottom half of bowl
    fill("#DBCEA5");
    ellipse(80, 72, 120, 30); // Top rim of bowl
  }
}

// Called directly from the HTML buttons
function handleChoice(choice) {
  if (choice === "yes") {
    document.getElementById("dialogue-text").innerText =
      "You ate the food. It tasted familiar.";
  } else {
    document.getElementById("dialogue-text").innerText =
      "You pushed the bowl away.";
  }

  // Hide buttons and return to game
  document.getElementById("options-container").style.display = "none";

  // Push player slightly back so they don't re-trigger immediately
  player.x -= 15;
  gameState = "EXPLORE";
}
