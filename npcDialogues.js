// ============================================
// NPC Dialogue Arrays
// Before I Forget - Dementia Game
// Author: Rini Lu
// ============================================

// ========== Spouse Dialogue ==========

// Day 1 — Warm, normal
let spouseDialogueDay1 = {
  kitchen: "Good morning.",
  livingRoom: "How are you feeling today?",
  name: "Emma"  // Spouse name displays normally
};

// Day 3 — Still warm, contrasts with player's confusion
let spouseDialogueDay3 = {
  kitchen: "You've always had this one.",       // About the tea canister
  livingRoom: "Anything interesting in the news?", // About the newspaper
  name: "Emma"  // Name still normal (contrasts with player's disorientation)
};

// Day 5 — Name starts to disappear (future plan)
let spouseDialogueDay5 = {
  kitchen: "You've always had this one.",
  livingRoom: "Do you remember what day it is?",
  name: "???"   // Can no longer recognize the name
};


// ========== Neighbor Dialogue ==========

// Day 1 — Normal, friendly
let neighborDialogueDay1 = {
  door: "Good morning.",
  name: "Neighbor"
};

// Day 3 — Corrects the player's perception (door number 204 vs 20?)
let neighborDialogueDay3 = {
  door: "Your apartment has always been 204.",
  name: "Neigh or"  // Name also starts to have gaps
};

// Day 5 — (future plan)
let neighborDialogueDay5 = {
  door: "...Are you alright?",
  name: "???"
};


// ========== Final Day Family Dialogue (future plan) ==========
// What the player subjectively hears (distorted) vs what is actually said (subtitle)

let familyDialogueFinal = {
  // What the player hears (distorted, displayed in large text)
  perceived: [
    "You can't do anything right.",
    "You don't even remember us.",
    "You're a burden."
  ],
  // What is actually said (real, displayed as small subtitle)
  actual: [
    "We're here.",
    "Take your time.",
    "It's okay."
  ]
};


// ============================================
// Usage: Get dialogue based on currentDay and currentRoom
// ============================================
// function getSpouseDialogue() {
//   if (currentDay === 1) return spouseDialogueDay1[currentRoom];
//   if (currentDay === 3) return spouseDialogueDay3[currentRoom];
//   if (currentDay === 5) return spouseDialogueDay5[currentRoom];
// }
//
// function getNeighborDialogue() {
//   if (currentDay === 1) return neighborDialogueDay1.door;
//   if (currentDay === 3) return neighborDialogueDay3.door;
//   if (currentDay === 5) return neighborDialogueDay5.door;
// }