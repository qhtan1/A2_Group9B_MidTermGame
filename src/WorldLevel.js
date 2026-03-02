class WorldLevel {
  constructor() {
    this.currentDay = 1;
    this.currentRoom = "Bedroom";

    // Day 1 Guided Path Sequence:
    // 0: Alarm -> 1: Mirror -> 2: Bed Door -> 3: Tea -> 4: Newspaper -> 5: Main Door -> 6: Doorplate
    this.sequenceStep = 0;
  }

  advanceSequence() {
    this.sequenceStep++;
  }

  changeRoom(newRoom) {
    this.currentRoom = newRoom;
  }
}
