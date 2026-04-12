# Before I Forget

**GBDA 302 — A3 Final Game (Group Project)**

🎮 **[Play the game here](https://qhtan1.github.io/A2_Group9B_MidTermGame/)**

---

## Group Members (Group 9B)

| Name | WatID | Student # |
|------|--------|-----------|
| Kiki Tan | qhtan | 20878699 |
| Tracey Chen | t44chen | 21057118 |
| Rini Lu | r28lu | 21091404 |
| Lynette Shen | l34shen | 21068630 |
| Annora Zhu | y65zhu | 21057605 |

---

## Description

*Before I Forget* is a narrative-driven top-down exploration game built with **p5.js** that fosters empathy for people living with **dementia and age-related cognitive decline**. The player steps into the daily morning routine of an elderly character across three playable days. As days progress, familiar objects, dialogue, time, controls, and even the player's own reflection begin to distort — communicating cognitive decline through systemic gameplay breakdown rather than explicit explanation.

The game culminates in a pre-ending family cutscene with mismatched audio and subtitles, followed by a branching final choice that produces one of two emotional endings.

### Three Distinct Game Mechanics

The final game implements **at least three distinct, integrated mechanics**, with new ones developed since the mid-term:

1. **Routine Checklist + Clarity System** *(carried from mid-term, refined)* — seven morning tasks tracked on-screen, with a Clarity HUD that decays as distortions accumulate.
2. **Daily Distortion System** *(expanded)* — escalating environmental, control, time, sprite, and dialogue distortions that scale across Day 1 → Day 3 → Day 5.
3. **Coin (Change) Collection Mechanic** *(NEW for A3)* — the character must gather a small number of coins hidden inside interaction scenes before being allowed to leave the apartment to "buy eggs." Each day the coins become smaller, more transparent, and pushed into the corners of the frame, mirroring the increasing difficulty of holding onto small details.

---

## Gameplay Overview

| Day | Coins Required | Experience |
|-----|----------------|------------|
| **Day 1** | 3 (16 px, full opacity, anywhere in scene) | Clear and familiar. Routine feels warm and grounded. |
| **Day 3** | 4 (12 px, ~43% opacity, hidden in corners) | Subtle distortions begin — scrambled labels, altered dialogue, fading details, "Something is wrong / Looks normal" observation prompts. |
| **Day 5** | 5 (8 px, ~22% opacity, tucked against frame edges) | Severe disorientation. Time skips, control misfires, sprite ages after mirror, wrong object feedback, stair gate, family cutscene, branching ending. |

### Routine Checklist
1. Check alarm
2. Look at mirror
3. Brew tea
4. Read news
5. Talk to partner
6. Check door number
7. Greet neighbor

### Coin Dialogue (per day)

- **Day 1:** *"I might need this." → "Better bring some change." → "That should be enough."* → goal: *"I can grab some groceries."*
- **Day 3:** *"Did I already take one?" → "Was this here before…?" → "Why am I collecting these again?" → "This should be enough… I hope."* → goal: *"It feels important."*
- **Day 5:** *"I need more." → "Still not enough." → "Why are there so many…?" → "Did I already check here?" → "I need them."* (no goal line — just unlock)

### Day 5 Distortions
- **Sprite swap** to elderly back/front sprites after the mirror interaction.
- **Time skipping** — the clock jumps in irregular intervals.
- **Control misfires** — WASD inputs occasionally produce the wrong direction.
- **Wrong object feedback** — alarm replies *"I should make tea"*, tea replies *"Why am I here?"*.
- **Stair gate** — leaving early triggers a game over.
- **Clarity refocus** — standing still for 3 seconds restores +1 Clarity.

### Family Cutscene + Endings
A family member enters and speaks. What is **heard** and what the **subtitles** show are different (with a 1–2 s delay), each line backed by its own audio clip (`Ending_1.mp3`, `Ending_2.mp3`, `Ending_3.mp3`). Background music distorts to level 3.

| Heard | Subtitles |
|-------|-----------|
| *"You can't do anything right."* | *"We're here."* |
| *"You don't remember us."* | *"Take your time."* |
| *"You're a burden."* | *"It's okay."* |

- **Ending A — Acceptance** (hold the hand): screen stabilizes, music returns to normal. *"Before I forget… Thank you for staying."*
- **Ending B — Isolation** (pull away): screen overexposes, distortion remains. *"Bef— For— Forget …"*

---

## Setup and Interaction Instructions

1. Open the [GitHub Pages link](https://qhtan1.github.io/A2_Group9B_MidTermGame/) in **Google Chrome** (latest version).
2. Press **Start** or **Enter** on the title screen.
3. Use **WASD** or **Arrow Keys** to move (may misfire on Day 5).
4. Approach objects marked with **!** and press **E** to open an interaction popup.
5. **Click coins** with the mouse inside popup scenes to collect them — watch the "Change" panel.
6. Press **Space** to close popups / advance dialogue.
7. On observation prompts, press **1** for *"Something is wrong"* or **2** for *"Looks normal"*.
8. Use the **♪** button to toggle background music.
9. On Day 5, complete enough routine tasks **and** collect 5 coins before reaching the stairs, or face an early ending.
10. At the end of Day 5, choose to **hold the hand** or **pull away** to determine your ending.

---

## Iteration Notes (Post-Playtest)

Three concrete changes were made between in-class playtesting (Mar 26) and final submission, based on peer/instructor feedback:

1. **Added a goal-driven coin (change) economy.** Playtesters reported that the routine alone did not give them enough moment-to-moment agency or a clear reason to look closely at each interaction scene. We added a per-day coin collection mechanic with shrinking, fading, corner-tucked coins to simulate the increasing effort of noticing small details, plus a hard exit-lock on the stairs until the daily quota is met.
2. **Replaced placeholder newspaper art with three day-specific images** (`Day 1`, `Day 3`, `Day 5`), and replaced the hand-drawn Day 5 letter fallback with a real image asset. This addressed feedback that the newspaper interaction felt visually inconsistent with the other popup scenes.
3. **Rebuilt the family cutscene audio** — replaced the single ambient track with three per-line clips (`Ending_1/2/3.mp3`) tied to each "heard" line, applied level-3 music distortion during the scene, and moved subtitle responses from a canvas overlay into the dialogue panel for consistency. Playtesters had said the original cutscene felt flat and the audio/subtitle disconnect was hard to read.

Additional fixes shipped post-playtest: Day 5 mirror interaction restored (race condition fix), elderly back-facing sprite case-sensitivity bug, Day 3 coins clickable through observation popups, Day 1/Day 3 partner & neighbour voice lines, admin debug shortcuts (` ` ` to toggle; 1/3/5 jump to days, 7 = family scene, H = Ending A, B = Ending B).

---

## Assets

All pixel-art backgrounds, character sprites, UI popup images, and interactive scene illustrations were created specifically for this project using **Google Gemini** (image generation, prompts documented in `Process_and_Decision_Documentation.pdf`, Appendix B). Backgrounds, the player sprite sheet, the elderly sprite sheet (`OldBack1–3.PNG`, `OldFront1–3.PNG`, etc.), and all popup scene art were generated by the team and selected/refined by hand. Voice lines (`Day1_Partner.mp3`, `Day1_neighbour.mp3`, `Day3_Partner.mp3`, `Day3_neighbour.mp3`, `Ending_1.mp3`, `Ending_2.mp3`, `Ending_3.mp3`) were recorded by team members.

**Non-original assets:**

- Background music: *"Cozy Lofi Music"* by Tunetank (royalty-free), file `tunetank-cozy-lofi-music-409359.mp3` [1].
- Alarm SFX: `alarm.mp3` (royalty-free).
- p5.js library v1.x [2], included locally in `libraries/`.

All non-original assets are royalty-free and used in compliance with their licenses.

---

## GenAI Disclosure

Generative AI tools (Google Gemini for image/asset generation; Claude Sonnet 4.6 via the Cowork desktop app for code debugging, audio integration, and the coin system implementation; ChatGPT for early code scaffolding) were used during development. Full per-exchange transcripts, prompts, dates, and human decision points are documented in `Process_and_Decision_Documentation.pdf`. All gameplay mechanics, narrative design, visual direction, and final implementation decisions were made and reviewed by the team. No AI-generated code or art was used without human review, modification, and integration.

---

## References

[1] Tunetank. n.d. *Cozy Lofi Music (Track 409359)*. Tunetank. https://tunetank.com/

[2] L. McCarthy and the Processing Foundation. 2024. *p5.js* (version 1.x) [JavaScript library]. https://p5js.org/

[3] World Health Organization. 2023. *Dementia*. World Health Organization. https://www.who.int/news-room/fact-sheets/detail/dementia

[4] KOTAKE CREATE. 2023. *The Exit 8* [Video game]. KOTAKE CREATE.

[5] Kojima Productions. 2014. *P.T.* [Video game]. Konami.

[6] SadSquare Studio. 2020. *Visage* [Video game]. SadSquare Studio.
