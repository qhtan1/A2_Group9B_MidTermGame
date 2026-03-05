# Before I Forget

**GBDA 302 — Midterm Game Project**

---

## Authors (Group 9B)

- Kiki Tan
- Tracey Chen
- Rini Lu
- Lynette Shen
- Annora Zhu

---

## Description

*Before I Forget* is a narrative-driven top-down exploration game built with p5.js. Players step into the daily routine of an elderly character experiencing the gradual onset of memory loss.

The game follows a repeating morning routine across multiple days — waking up, checking the mirror, making tea, reading the newspaper, talking to a partner, and greeting a neighbor. As days progress, familiar objects and interactions begin to distort: clock digits blur, tea labels become unreadable, newspaper headlines scramble, and the door number fades. Through these subtle environmental changes, the player experiences the disorientation and emotional weight of cognitive decline firsthand.

---

## Gameplay

The game is structured around **two playable days** that share the same sequence of events but differ in clarity and tone:

- **Day 1 (Baseline):** Everything is clear and familiar. The routine feels warm and grounded.
- **Day 3 (Distortion):** The same routine, but details are wrong — labels are misspelled, reflections feel unfamiliar, and the world becomes uncertain.

### Rooms

1. **Bedroom** — Wake up, check the alarm clock, look in the mirror.
2. **Kitchen** — Find the tea canister.
3. **Living Room** — Read the newspaper, talk to your partner.
4. **Outside (Hallway)** — Check the door plate, greet the neighbor.

---

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move up |
| S / ↓ | Move down |
| A / ← | Move left |
| D / → | Move right |
| E | Interact with objects (marked with **!**) |
| Space | Close popup / Advance dialogue |

---

## Technical Implementation

- **Engine:** p5.js
- **Architecture:** Modular class-based design with separate files for Player, WorldLevel, and game logic.
- **Level Data:** JSON-driven configuration for each day, defining NPC names, dialogue, item labels, and distortion parameters.
- **Sprite Animation:** 3-frame walk cycle in 4 directions, loaded from individual sprite sheets.
- **Collision Detection:** AABB (Axis-Aligned Bounding Box) system for obstacle and boundary checks.
- **Room Transitions:** Sequential event system where interacting with objects advances the player through a fixed narrative order.
- **Day Progression:** After completing the Day 1 routine, a fade-to-black transition resets the world with Day 3 parameters, introducing visual and textual distortion.

---

## Learning Goals

This project demonstrates the following:

- Using `preload()` and `loadImage()` to manage asset loading before game start.
- Designing a data-driven day system using JSON to define dialogue, labels, and distortion levels.
- Building modular game architecture with separate classes for player movement, world state, and rendering.
- Implementing AABB collision detection for room obstacles.
- Managing sequential game states (EXPLORE → INTERACT → TRANSITION) to control narrative flow.
- Creating environmental storytelling through subtle visual changes across days rather than explicit narration.

---

## Assets

All pixel art backgrounds, character sprites, UI popup images, and interactive scene illustrations were created for this project. Asset files are organized in the `assets/` folder.

---

## GenAI Disclosure

Generative AI was used as a development aid for code debugging, gameplay logic implementation, and art asset creation. All gameplay mechanics, narrative design, visual direction, and final implementation decisions were reviewed and finalized by the team.

---
