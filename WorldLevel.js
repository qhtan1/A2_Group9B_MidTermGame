class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = levelJson.theme;

    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    this.camLerp = levelJson.camera?.lerp ?? 0.05;

    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 480;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    this.start = levelJson.start;

    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );

    this.letters = (levelJson.letters ?? []).map(
      (l) => new Letter(l.char, l.x, l.y),
    );
  }

  drawWorld() {
    rectMode(CORNER);
    noStroke();

    for (const p of this.platforms) {
      // main body
      fill(this.theme.platform);
      rect(p.x, p.y, p.w, p.h);

      // top highlight strip
      fill(this.theme.platformEdge);
      rect(p.x, p.y, p.w, 4);
    }
  }
}
