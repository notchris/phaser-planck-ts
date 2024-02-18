import Phaser from "phaser";

export default class DemoEvents extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoEvents" });
  }

  preload() {}

  init() {}

  create() {
    // Ground Texture
    const groundTexture = this.add.graphics();
    groundTexture.fillStyle(0xff0000);
    groundTexture.fillRect(0, 0, 1024, 1);
    groundTexture.generateTexture("demo_events_ground", 1024, 1);
    groundTexture.destroy();

    // Ground Sprite
    const groundSprite = this.planck.add.sprite(0, 512, "demo_events_ground");
    groundSprite.setBox();
    groundSprite.setStatic();

    // Ball Texture
    const ballTexture = this.add.graphics();
    ballTexture.fillStyle(0xffffff);
    ballTexture.fillCircle(15, 15, 15);
    ballTexture.generateTexture("demo_events_ball", 30, 30);
    ballTexture.destroy();

    // Ball Drop Timer
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const ball = this.planck.add.sprite(
          Phaser.Math.Between(200, 300),
          100,
          "demo_events_ball"
        );
        ball.setCircle({
          restitution: Phaser.Math.FloatBetween(0.0, 0.9),
        });
        ball.setDynamic();
        ball.setTintFill(0xcccccc);
        this.time.delayedCall(
          5000,
          () => {
            ball.destroy();
          },
          undefined,
          this
        );

        ball.on(
          "collision-start",
          () => {
            ball.setTintFill(0xffff00);
          },
          this
        );

        ball.on(
          "collision-end",
          () => {
            ball.setTintFill(0x00ff00);
          },
          this
        );
      },
      //args: [],
      callbackScope: this,
      repeat: 10,
    });
  }
}
