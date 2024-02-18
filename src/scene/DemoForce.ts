import Phaser from "phaser";

export default class DemoForce extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoForce" });
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
    ballTexture.generateTexture("demo_force_ball", 30, 30);
    ballTexture.destroy();

    const balls = [];
    for (let i = 0; i < 5; i += 1) {
      const ball = this.planck.add.sprite(
        300 + i * 100,
        300,
        "demo_force_ball"
      );
      ball.setCircle({
        restitution: 0.5,
      });
      ball.setDynamic();
      const tint = `0x${Math.floor(Math.random() * 16777215).toString(
        16
      )}` as unknown as number;
      ball.setTintFill(tint);
      balls.push(ball);

      this.time.addEvent({
        delay: 4000,
        callback: () => {
          console.log("ok");
          ball.applyForceToCenter(
            { x: 0, y: -Phaser.Math.Between(-2000, -500) },
            true
          );
        },
        callbackScope: this,
        repeat: -1,
      });
    }
  }
}
