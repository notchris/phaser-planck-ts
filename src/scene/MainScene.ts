import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
  };
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {}

  init() {}

  create() {
    console.log(this.planck);

    // Ground Texture
    const groundTexture = this.add.graphics();
    groundTexture.fillStyle(0x666666);
    groundTexture.fillRect(0, 0, 640, 40);
    groundTexture.generateTexture("demo_basic_ground", 640, 40);
    groundTexture.destroy();

    // Ground Sprite
    const groundSprite = this.planck.add.sprite(0, 400, "demo_basic_ground");
    groundSprite.setBox();
    groundSprite.setStatic();

    // Box Texture
    const boxTexture = this.add.graphics();
    boxTexture.fillStyle(0xffff00);
    boxTexture.fillRect(0, 0, 100, 100);
    boxTexture.generateTexture("box", 100, 100);
    boxTexture.destroy();

    // Ball Texture
    const ballTexture = this.add.graphics();
    ballTexture.fillStyle(0xffffff);
    ballTexture.fillCircle(15, 15, 15);
    ballTexture.generateTexture("ball", 30, 30);
    ballTexture.destroy();

    // Polygon Texture
    const polyTexture = this.add.graphics();
    polyTexture.fillStyle(0x00ff00);
    const polypoints = [
      { x: 0, y: 64 },
      { x: 64, y: 64 },
      { x: 64, y: 0 },
    ];
    polyTexture.fillPoints(polypoints, true, true);
    polyTexture.generateTexture("poly", 64, 64);
    polyTexture.destroy();

    // Polygon
    const box = this.planck.add.sprite(100, 300, "box");
    box.setBox();
    box.setStatic();

    // Polygon
    const poly = this.planck.add.sprite(300, 200, "poly");
    poly.setPolygon([
      { x: 0, y: 64 },
      { x: 64, y: 64 },
      { x: 64, y: 0 },
    ]);
    poly.setStatic();

    // Ball Drop Timer
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const ball = this.planck.add.sprite(
          Phaser.Math.Between(200, 300),
          100,
          "ball"
        );
        ball.setCircle({ restitution: 0.5 });
        ball.setDynamic();
        ball.setTintFill(0xff0000);
        this.time.delayedCall(
          3000,
          () => {
            ball.destroy();
          },
          undefined,
          this
        );
      },
      //args: [],
      callbackScope: this,
      repeat: 10,
    });
  }
}
