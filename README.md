# Before I Forget

**GBDA 302 — Midterm Game Project**

## Authors (Group 9B)

- Kiki Tan
- Tracey Chen
- Rini Lu
- Lynette Shen
- Annora Zhu

## Description

*Before I Forget* is a narrative-driven top-down exploration game built with p5.js. Players step into the daily routine of an elderly character experiencing the gradual onset of memory loss.

The game follows a repeating morning routine across multiple days — waking up, checking the mirror, making tea, reading the newspaper, talking to a partner, and greeting a neighbor. As days progress, familiar objects and interactions begin to distort: clock digits blur, tea labels become unreadable, newspaper headlines scramble, and the door number fades.

Through these subtle environmental changes, the player experiences the disorientation and emotional weight of cognitive decline firsthand. The game communicates cognitive decline through environmental storytelling rather than explicit explanation.

## Gameplay

The game is structured around **two playable days** that share the same sequence of events but differ in clarity and tone.

- **Day 1 (Baseline):** Everything is clear and familiar. The routine feels warm and grounded.
- **Day 3 (Distortion):** The same routine occurs, but environmental details become unreliable. Labels change, objects behave unexpectedly, and the world begins to feel unfamiliar.

## Core Game Mechanics

The game uses several mechanics to simulate the experience of memory decline.

### Routine-Based Progression
Players complete a sequence of morning tasks that represent everyday activities. The routine structure creates familiarity so that later distortions become noticeable and emotionally impactful.

### Environmental Distortion
In later days, the same environment contains subtle errors such as scrambled text, incorrect labels, or altered dialogue. These distortions simulate the confusion experienced during cognitive decline.

### Sequential Interaction System
Objects must be interacted with in a specific order. Completing interactions advances the routine and progresses the narrative.

### Clarity System
The player’s mental clarity is represented through visual indicators. As the day progresses, clarity decreases and distortions become more noticeable.

## Game World

The environment is divided into several rooms representing parts of the character’s home and neighborhood.

### Bedroom
- Wake up
- Check the alarm clock
- Look in the mirror

### Kitchen
- Locate the tea canister
- Brew tea

### Living Room
- Read the newspaper
- Talk to your partner

### Outside (Hallway)
- Check the door plate
- Greet the neighbor

Each location represents a familiar space that later becomes subtly distorted.

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move up |
| S / ↓ | Move down |
| A / ← | Move left |
| D / → | Move right |
| E | Interact with objects marked with **!** |
| Space | Close popup / advance dialogue |

## Technical Implementation

- **Engine:** p5.js
- **Architecture:** Modular class-based design with separate files for Player, WorldLevel, and game systems.
- **Level Data:** JSON-driven configuration defining dialogue, object labels, and distortion parameters.
- **Sprite Animation:** 3-frame walking animation in four directions.
- **Collision Detection:** AABB (Axis-Aligned Bounding Box) collision system for obstacles.
- **Room Transitions:** Sequential interaction events advance the player through the routine.
- **Day Progression:** Completing the Day 1 routine triggers a transition to Day 3, where visual and textual distortions are introduced.

## Learning Goals

This project demonstrates several technical and design concepts:

- Using `preload()` and `loadImage()` for asset management
- Implementing data-driven game states using JSON
- Designing modular architecture with separate classes
- Implementing collision detection using AABB
- Managing narrative progression using interaction sequences
- Creating environmental storytelling through subtle visual changes rather than explicit explanation

## Setup and Interaction Instructions

1. Open the game in a browser through GitHub Pages or a local server.
2. Use **WASD** or **Arrow Keys** to move the player.
3. Approach interactive objects marked with **!**.
4. Press **E** to interact with objects and progress through the morning routine.
5. Press **Space** to close dialogue popups or continue text.
6. Complete all routine tasks to advance from Day 1 to Day 3.

## Iteration Notes

### Post-Playtest Changes

Based on in-class playtesting feedback, the following changes were implemented:

- Improved interaction indicators by adding **! markers** to objects players can interact with
- Simplified some room layouts to make important objects easier to identify
- Adjusted dialogue pacing so players could more clearly understand the routine structure

### Post-Showcase Improvements

Planned improvements following instructor and TA feedback include:

- Expanding environmental distortions to make the progression between days more noticeable
- Improving sound design and ambient feedback to strengthen emotional immersion

## Assets

All pixel art backgrounds, character sprites, UI popup images, and interactive scene illustrations were created specifically for this project.

Assets are organized in the `assets/` folder.

## GenAI Disclosure

Generative AI tools were used during development to assist with code debugging, gameplay logic exploration, and art asset generation.

All gameplay mechanics, narrative design, visual direction, and final implementation decisions were determined and reviewed by the team.

GenAI outputs were treated as development assistance rather than final solutions, and all generated material was modified or integrated through human decision-making.

## References

- World Health Organization. *Dementia*. 2023.
