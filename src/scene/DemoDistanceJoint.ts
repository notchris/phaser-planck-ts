import Phaser from "phaser";
import { createGround } from "./util";

export default class DemoDistanceJoint extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: true,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoDistanceJoint" });
  }

  preload() {}

  init() {}

  create() {
    const { width } = this.game.canvas;

    // Box Texture
    const boxTexture = this.add.graphics();
    boxTexture.fillStyle(0xffff00);
    boxTexture.fillRect(0, 0, 100, 100);
    boxTexture.generateTexture("box", 100, 100);
    boxTexture.destroy();

    // Box A
    const boxA = this.planck.add.sprite(width / 2 - 50, 180, "box");
    boxA.setBox();
    boxA.setTintFill(0xff0000);

    // Box B
    const boxB = this.planck.add.sprite(width / 2 - 50, 400, "box");
    boxB.setBox();
    boxB.setDynamic();
    boxB.setTintFill(0xff0000);

    // Create distance joint
    const joint = this.planck.add.distanceJoint(
      boxA,
      boxB,
      boxA.getBodyWorldCenter(),
      boxB.getBodyWorldCenter(),
      {
        dampingRatio: 0.1,
      }
    );
    console.log(joint);

    this.time.delayedCall(
      2000,
      () => {
        boxB.applyForce({ x: 3000, y: 0 }, boxB.getBodyWorldCenter(), true);
      },
      undefined,
      this
    );

    createGround(this);
  }

  shutdown() {
    console.log("shutdown what");
  }
}
