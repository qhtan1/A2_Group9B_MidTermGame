// ============================================
// Newspaper Text Arrays
// Before I Forget - Dementia Game
// Author: Rini Lu
// ============================================

// Day 1 — Clear, normal newspaper content (baseline)
let newspaperTitleDay1 = "City Celebrates Spring Festival This Weekend";
let newspaperBodyDay1 = [
  "The annual Spring Festival returns to Maple Park this Saturday.",
  "Local vendors will offer handmade crafts, fresh produce, and live music.",
  "Mayor Johnson encourages all residents to attend.",
  "The event runs from 10 AM to 6 PM, rain or shine."
];

// Day 3 — Some letters missing/distorted (dementia perspective)
let newspaperTitleDay3 = "Ci y Cele ra es Sp ing Fes iv l Th s W ekend";
let newspaperBodyDay3 = [
  "Th  ann al Spr ng Fe tival r turns to Ma le P rk this S turday.",
  "Lo al v ndors wi l off r han made cr fts, fre h pro uce, and l ve m sic.",
  "Ma or Jo nson enc ur ges a l resi ents to att nd.",
  "T e ev nt ru s fr m 10 AM to 6 PM, r in or sh ne."
];

// Day 5 — Fully scrambled / unreadable (future plan)
let newspaperTitleDay5 = "??? ????????? ?????? ???????? ???? ???????";
let newspaperBodyDay5 = [
  "... ... ...... ........ ....... .. ..... .... .... .........",
  "????? ??????? ???? ????? ????????? ??????, ????? ???????, ??? ???? ?????.",
  ".........................................................",
  ".. ... .... .... .. .. .. . .., .... .. ....."
];

// ============================================
// Usage: Select text based on currentDay in sketch.js
// ============================================
// function getNewspaperTitle() {
//   if (currentDay === 1) return newspaperTitleDay1;
//   if (currentDay === 3) return newspaperTitleDay3;
//   if (currentDay === 5) return newspaperTitleDay5;
// }
//
// function getNewspaperBody() {
//   if (currentDay === 1) return newspaperBodyDay1;
//   if (currentDay === 3) return newspaperBodyDay3;
//   if (currentDay === 5) return newspaperBodyDay5;
// }