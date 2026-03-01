## Project Title

GBDA302 Week 5 Side Quest: Journey to Courage

---

## Authors

Annora Zhu

---

## Description

Journey to Courage is a reflective side-scrolling platformer built using p5.js and external JSON level data. The player controls a soft, animated blob character that travels through a horizontally scrolling world larger than the screen.

Along the journey, the player collects glowing letters that gradually form the word COURAGE. Each collected letter transitions from the world into the sky, visually accumulating across the top of the screen. When the final letter is collected, the individual letters disappear and the complete word appears centered on the screen, representing the completion of the journey.

The level uses platform traversal, gaps, and vertical height variation to create increasing difficulty while maintaining a calm and atmospheric tone. The smooth camera movement and gradient sky background emphasize pacing and reflection rather than fast arcade-style gameplay.

---

## Learning Goals

This project demonstrates the following learning goals:

- Using preload() and loadJSON() to ensure external level data loads before setup runs.

- Designing a data-driven level structure using JSON to define:
  - World dimensions
  - Platform placement
  - Letter positions
  - Camera smoothing

- Building modular game architecture with separate classes for:
  - Player movement and physics
  - Camera tracking
  - World rendering
  - Letter collectibles

- Implementing collision detection between player and platforms.

- Creating a smooth side-scrolling camera using interpolation (lerp).

- Managing game states including:
  - Active gameplay
  - Letter collection
  - Final completion sequence

- Designing a progression system where visual accumulation (letters forming a word) replaces traditional scoring.

---

## Controls

- Move: A / D or ← / →
- Jump: W / ↑ / Space
- Reset: R

## Assets

N/A

---

## GenAI

Generative AI was used as a development aid for debugging, balancing platform spacing, refining animation timing, and improving code clarity. All gameplay mechanics, visual design decisions, and structural implementation were reviewed and finalized by the author.

---
