import Phaser from "phaser";
import { createRamps } from "./util";

export default class DemoEdges extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoEdges" });
  }

  preload() {}

  init() {}

  create() {
    // Ball Texture
    const ballTexture = this.add.graphics();
    ballTexture.fillStyle(0xffffff);
    ballTexture.fillCircle(15, 15, 15);
    ballTexture.generateTexture("demo_edges_ball", 30, 30);
    ballTexture.destroy();

    // Ball Drop Timer
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const ball = this.planck.add.sprite(
          Phaser.Math.Between(200, 300),
          100,
          "demo_edges_ball"
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

    createRamps(this);
  }
}
