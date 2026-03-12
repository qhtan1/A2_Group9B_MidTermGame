class TimerSystem {
  constructor() {
    // Real-world duration: 180 seconds = 3 minutes
    // Game-time represented: 7:00 AM → 7:45 AM (45 game-minutes)
    this.totalSeconds = 3 * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isActive = false;
    this.startTime = 0;
    this.pausedTime = 0;

    // Day 3 time distortion
    this.isDistorted = false;
    this.lastJumpTime = 0;
    this.jumpInterval = 15000; // Jump roughly every 15 seconds
  }

  /**
   * Start the timer (called when player interacts with alarm clock)
   */
  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.startTime = millis();
      this.pausedTime = 0;
    }
  }

  /**
   * Stop the timer
   */
  stop() {
    this.isActive = false;
  }

  /**
   * Reset timer to full 3 minutes
   */
  reset() {
    this.remainingSeconds = this.totalSeconds;
    this.isActive = false;
    this.startTime = 0;
    this.pausedTime = 0;
    this.lastJumpTime = 0;
  }

  /**
   * Enable Day 3 time distortion effect
   */
  enableDistortion() {
    this.isDistorted = true;
    this.lastJumpTime = millis();
  }

  /**
   * Disable time distortion
   */
  disableDistortion() {
    this.isDistorted = false;
  }

  /**
   * Update timer each frame
   */
  update() {
    if (!this.isActive) return;

    let elapsed = millis() - this.startTime - this.pausedTime;
    this.remainingSeconds = max(0, this.totalSeconds - elapsed / 1000);

    // Day 3 time jumps: occasionally jump ahead 3-5 seconds
    if (this.isDistorted && this.remainingSeconds > 0) {
      let now = millis();
      if (now - this.lastJumpTime > this.jumpInterval) {
        // Jump forward by 3-5 seconds randomly by shifting startTime back
        let jumpAmount = random(3, 5);
        this.startTime -= jumpAmount * 1000;
        this.lastJumpTime = now;
      }
    }

    // Check if time is up
    if (this.remainingSeconds <= 0) {
      this.remainingSeconds = 0;
      this.isActive = false;
    }

    // Update HTML display
    this.updateHTMLDisplay();
  }

  /**
   * Check if time has run out
   * @returns {boolean}
   */
  hasExpired() {
    return this.remainingSeconds <= 0;
  }

  /**
   * Get elapsed game-minutes (0–45)
   * @returns {number}
   */
  getGameMinutes() {
    let elapsed = this.totalSeconds - this.remainingSeconds;
    return min(45, floor(elapsed * 45 / this.totalSeconds));
  }

  /**
   * Get formatted clock time string (7:MM)
   * @returns {string}
   */
  getFormattedTime() {
    let gm = this.getGameMinutes();
    let minStr = gm < 10 ? "0" + gm : "" + gm;
    return "7:" + minStr;
  }

  /**
   * Get remaining seconds as number
   * @returns {number}
   */
  getSeconds() {
    return this.remainingSeconds;
  }

  /**
   * Get whether timer is currently running
   * @returns {boolean}
   */
  getIsActive() {
    return this.isActive;
  }

  /**
   * Draw timer display in top-left corner
   * NOTE: This is now handled by CSS in index.html and style.css
   * Keeping method for backwards compatibility
   */
  draw() {
    // P5.js drawing disabled - using HTML/CSS instead
    this.updateHTMLDisplay();
  }

  /**
   * Update the HTML timer display
   */
  updateHTMLDisplay() {
    const timerDisplay = document.getElementById("timer-display");
    if (timerDisplay) {
      timerDisplay.textContent = this.getFormattedTime();

      // Change color as deadline approaches
      let gm = this.getGameMinutes();
      if (gm >= 42) {
        timerDisplay.style.color = "#f44336"; // Red  — 7:42+
      } else if (gm >= 37) {
        timerDisplay.style.color = "#ff9800"; // Orange — 7:37+
      } else {
        timerDisplay.style.color = "#5a4a2f"; // Normal
      }
    }
  }
}
