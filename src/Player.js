class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = 1.5;
  }

  draw() {
    fill("#B97A6A");
    noStroke();
    ellipseMode(CORNER);
    ellipse(this.x, this.y, this.w, this.h);
  }

  handleMovement(obstacles, canvasWidth, canvasHeight) {
    let nextX = this.x;
    let nextY = this.y;

    // Supports WASD and Arrow Keys
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) nextY -= this.speed; // W / UP
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) nextY += this.speed; // S / DOWN
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) nextX -= this.speed; // A / LEFT
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) nextX += this.speed; // D / RIGHT

    // Screen bounds
    nextX = constrain(nextX, 0, canvasWidth - this.w);
    nextY = constrain(nextY, 0, canvasHeight - this.h);

    let canMoveX = true;
    let canMoveY = true;

    // AABB Collision Detection
    for (let obs of obstacles) {
      if (
        this.checkCollision(
          nextX,
          this.y,
          this.w,
          this.h,
          obs.x,
          obs.y,
          obs.w,
          obs.h,
        )
      )
        canMoveX = false;
      if (
        this.checkCollision(
          this.x,
          nextY,
          this.w,
          this.h,
          obs.x,
          obs.y,
          obs.w,
          obs.h,
        )
      )
        canMoveY = false;
    }

    if (canMoveX) this.x = nextX;
    if (canMoveY) this.y = nextY;
  }

  checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }
}
