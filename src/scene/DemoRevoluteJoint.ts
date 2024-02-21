import Phaser from "phaser";
import { createGround } from "./util";

export default class DemoRevoluteJoint extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: true,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoRevoluteJoint" });
  }

  preload() {}

  init() {}

  create() {
    const { width, height } = this.game.canvas;

    // Box Texture
    const boxTexture = this.add.graphics();
    boxTexture.fillStyle(0xffff00);
    boxTexture.fillRect(0, 0, 400, 30);
    boxTexture.generateTexture("demo_revolute_box", 400, 30);
    boxTexture.destroy();

    // circle Texture
    const circleTexture = this.add.graphics();
    circleTexture.fillStyle(0xffffff);
    circleTexture.fillCircle(15, 15, 15);
    circleTexture.generateTexture("demo_revolute_circle", 30, 30);
    circleTexture.destroy();

    // Ball Texture
    const ballTexture = this.add.graphics();
    ballTexture.fillStyle(0xffffff);
    ballTexture.fillCircle(15, 15, 15);
    ballTexture.generateTexture("demo_revolute_ball", 30, 30);
    ballTexture.destroy();

    // Ball Drop Timer
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const ball = this.planck.add.sprite(
          Phaser.Math.Between(300, 600),
          20,
          "demo_revolute_ball"
        );
        ball.setCircle({
          restitution: 0.5,
        });
        ball.setDynamic();
        ball.setTintFill(0xdddddd);
        this.time.delayedCall(
          10000,
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

    // Box
    const box = this.planck.add.sprite(
      width / 2 - 200,
      height / 2 + 15,
      "demo_revolute_box"
    );
    box.setBox();
    box.setDynamic();
    box.setTintFill(0xff0000);

    // Circle
    const circle = this.planck.add.sprite(
      width / 2,
      height / 2,
      "demo_revolute_circle"
    );
    circle.setCircle();
    circle.setTintFill(0xffff00);

    // Create revolute joint
    const joint = this.planck.add.revoluteJoint(
      circle,
      box,
      circle.getBodyWorldCenter(),
      {
        collideConnected: false,
      }
    );
    console.log(joint);

    createGround(this);
  }

  shutdown() {
    console.log("shutdown what");
  }
}
