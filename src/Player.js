class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w; // 真实的物理碰撞箱宽度 (20)
    this.h = h; // 真实的物理碰撞箱高度 (20)
    this.speed = 1.5;

    // --- 新增：动画状态 ---
    this.direction = "down";
    this.isMoving = false;
    this.animFrame = 0;
  }

  draw() {
    // 动画帧切换逻辑：每 10 帧换一次动作 (数字越大走得越慢)
    if (this.isMoving) {
      if (frameCount % 10 === 0) {
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      this.animFrame = 0; // 停止移动时，回到站立的静止帧 (数组里的第 0 张图)
    }

    // 从全局 playerSprites (在 sketch.js 中定义) 获取当前方向和帧数的图片
    let currentImg = null;
    if (typeof playerSprites !== "undefined" && playerSprites[this.direction]) {
      currentImg = playerSprites[this.direction][this.animFrame];
    }

    if (currentImg) {
      // 老爷爷的图片素材比物理碰撞箱（20x20）大，进行视觉居中并向上对齐
      let drawW = 40; // 绘制的图片宽度
      let drawH = 50; // 绘制的图片高度

      // X轴居中，Y轴向上提，确保老爷爷的脚底踩在 20x20 碰撞箱的最底端
      let drawX = this.x + this.w / 2 - drawW / 2;
      let drawY = this.y + this.h - drawH + 4;

      image(currentImg, drawX, drawY, drawW, drawH);
    } else {
      // 降级方案：如果图片因为路径错误没加载出来，还是画个红圈防报错
      fill("#B97A6A");
      noStroke();
      ellipseMode(CORNER);
      ellipse(this.x, this.y, this.w, this.h);
    }

    // 调试模式下，额外画出真实的“蓝色”物理碰撞箱，方便你对比图片和物理体积的位置
    if (typeof showDebug !== "undefined" && showDebug) {
      fill(0, 0, 255, 100);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  handleMovement(obstacles, canvasWidth, canvasHeight) {
    let nextX = this.x;
    let nextY = this.y;
    this.isMoving = false; // 每次检测前先重置为静止

    // 获取按键，设置移动状态和对应的图片朝向 (direction)
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
      nextY -= this.speed;
      this.direction = "up";
      this.isMoving = true;
    } else if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
      nextY += this.speed;
      this.direction = "down";
      this.isMoving = true;
    }

    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      nextX -= this.speed;
      this.direction = "left";
      this.isMoving = true;
    } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      nextX += this.speed;
      this.direction = "right";
      this.isMoving = true;
    }

    // 画布边界限制
    nextX = constrain(nextX, 0, canvasWidth - this.w);
    nextY = constrain(nextY, 0, canvasHeight - this.h);

    let canMoveX = true;
    let canMoveY = true;

    // AABB 防穿模碰撞检测
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
