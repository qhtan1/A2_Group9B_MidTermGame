class TimerSystem {
  constructor() {
    this.totalSeconds = 3 * 60; // 3 minutes = 180 seconds
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
   * Get formatted time string (MM:SS)
   * @returns {string}
   */
  getFormattedTime() {
    let minutes = floor(this.remainingSeconds / 60);
    let seconds = floor(this.remainingSeconds % 60);

    let minStr = minutes < 10 ? "0" + minutes : minutes;
    let secStr = seconds < 10 ? "0" + seconds : seconds;

    return minStr + ":" + secStr;
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

      // Change color if critical
      if (this.remainingSeconds <= 30) {
        timerDisplay.style.color = "#f44336"; // Red
      } else if (this.remainingSeconds <= 60) {
        timerDisplay.style.color = "#ff9800"; // Orange
      } else {
        timerDisplay.style.color = "#5a4a2f"; // Normal
      }
    }
  }
}
