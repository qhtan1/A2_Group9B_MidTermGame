// ============================================
// Tea Canister Interaction Logic
// Before I Forget - Dementia Game
// Author: Rini Lu
// ============================================

// --- Tea label text per day ---
let teaLabelDay1 = "TEA";        // Day 1: Normal and clear
let teaLabelDay3 = "T  A";       // Day 3: Middle letter fading
let teaLabelDay5 = "???";        // Day 5: Completely unrecognizable (future plan)

// --- Tea interaction state ---
let teaPopupActive = false;       // Whether the tea popup is open
let teaChoiceActive = false;      // Whether the two choice buttons are showing
let teaDistortionTriggered = false; // Whether distortion has been triggered

// --- Tea Interaction Flow ---
// 1. Player approaches the tea canister -> "!" exclamation mark appears
// 2. Press E -> Zoomed-in tea canister panel pops up (shows label)
// 3. Day 1: Only shows normal label, press SPACE to close
// 4. Day 3: Shows blurry label + two choice buttons appear

function openTeaPopup() {
  teaPopupActive = true;
  
  if (currentDay === 1) {
    // Day 1: Show normal tea label
    // Press SPACE to close
    teaChoiceActive = false;
  }
  
  if (currentDay >= 3) {
    // Day 3+: Show blurry label + two choice buttons
    teaChoiceActive = true;
  }
}

function drawTeaPopup() {
  if (!teaPopupActive) return;
  
  // Draw semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Draw zoomed-in tea canister panel
  let panelX = width / 2 - 150;
  let panelY = height / 2 - 100;
  let panelW = 300;
  let panelH = 200;
  
  fill(244, 230, 193); // Warm yellow #F4E6C1
  rect(panelX, panelY, panelW, panelH, 10);
  
  // Display tea label
  fill(46, 46, 46); // Dark gray #2E2E2E
  textAlign(CENTER, CENTER);
  textSize(32);
  
  if (currentDay === 1) {
    text(teaLabelDay1, width / 2, height / 2 - 30);
    // Prompt to press SPACE to close
    textSize(14);
    text("Press SPACE to close", width / 2, height / 2 + 60);
  }
  
  if (currentDay >= 3) {
    // Day 3: Blurry label + slight UI jitter
    let jitterX = random(-1, 1); // Uses Lynette's jitter effect
    let jitterY = random(-1, 1);
    text(teaLabelDay3, width / 2 + jitterX, height / 2 - 30 + jitterY);
    
    // Show two choice buttons
    if (teaChoiceActive) {
      drawTeaChoices(panelX, panelY, panelW, panelH);
    }
  }
}

function drawTeaChoices(panelX, panelY, panelW, panelH) {
  let btnW = 120;
  let btnH = 35;
  let btnY = panelY + panelH - 55;
  
  // Button 1: "It's fine."
  let btn1X = panelX + 20;
  fill(185, 122, 106); // Brick red-brown #B97A6A
  rect(btn1X, btnY, btnW, btnH, 5);
  fill(255);
  textSize(14);
  text("It's fine.", btn1X + btnW / 2, btnY + btnH / 2);
  
  // Button 2: "Look closer."
  let btn2X = panelX + panelW - btnW - 20;
  fill(185, 122, 106);
  rect(btn2X, btnY, btnW, btnH, 5);
  fill(255);
  text("Look closer.", btn2X + btnW / 2, btnY + btnH / 2);
}

// --- Click handling ---
function handleTeaClick(mx, my) {
  if (!teaChoiceActive) return;
  
  let panelX = width / 2 - 150;
  let panelY = height / 2 - 100;
  let panelW = 300;
  let panelH = 200;
  let btnW = 120;
  let btnH = 35;
  let btnY = panelY + panelH - 55;
  
  // Check "It's fine." button
  let btn1X = panelX + 20;
  if (mx > btn1X && mx < btn1X + btnW && my > btnY && my < btnY + btnH) {
    // Player chose "It's fine." -> Close popup, no distortion triggered
    teaPopupActive = false;
    teaChoiceActive = false;
    // Spouse says: "You've always had this one."
    triggerDialogue("You've always had this one.");
  }
  
  // Check "Look closer." button
  let btn2X = panelX + panelW - btnW - 20;
  if (mx > btn2X && mx < btn2X + btnW && my > btnY && my < btnY + btnH) {
    // Player chose "Look closer." -> Trigger distortion effect
    teaDistortionTriggered = true;
    // Zoomed text becomes more blurry + UI jitter intensifies
    // -> Calls Lynette's distortion function
    teaPopupActive = false;
    teaChoiceActive = false;
    // Spouse says: "You've always had this one."
    triggerDialogue("You've always had this one.");
  }
}

// --- Placeholder functions (need integration with Annora/Tracey/Lynette) ---
// function triggerDialogue(text) { ... }  // Annora's dialogue system