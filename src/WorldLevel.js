class WorldLevel {
  constructor() {
    this.rooms = ["LivingRoom", "Bathroom"];
    this.currentRoomIndex = 0;
    this.currentDay = 1;
  }

  getCurrentRoom() {
    return this.rooms[this.currentRoomIndex];
  }

  // Top-down room switching logic
  checkDoorways(playerX, playerY, width, height) {
    // Walk off the right screen to go to the Bathroom
    if (playerX > width && this.currentRoomIndex === 0) {
      this.currentRoomIndex = 1;
      return { x: 10, y: playerY };
    }
    // Walk off the left screen to return to Living Room
    if (playerX < 0 && this.currentRoomIndex === 1) {
      this.currentRoomIndex = 0;
      return { x: width - 10, y: playerY };
    }
    return { x: playerX, y: playerY };
  }
}
