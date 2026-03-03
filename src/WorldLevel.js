class WorldLevel {
  constructor() {
    this.currentDay = 1;
    this.currentRoom = "Bedroom";

    // Day 1 Sequence Updated:
    // 0: Alarm -> 1: Mirror -> 2: Bedroom Door ->
    // 3: Tea -> 4: Kitchen Door (Exit to Living Room) ->
    // 5: Newspaper -> 6: Main Door -> 7: Doorplate
    this.sequenceStep = 0;
  }

  advanceSequence() {
    this.sequenceStep++;
  }

  changeRoom(newRoom) {
    this.currentRoom = newRoom;
  }
}
