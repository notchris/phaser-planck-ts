import Phaser from "phaser";
import { createGround } from "./util";

export default class DemoShapes extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoShapes" });
  }

  preload() {}

  init() {}

  create() {
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
    // Extra pixel to fix extrusion?
    polyTexture.generateTexture("poly", 65, 65);
    polyTexture.destroy();

    // Polygon
    const box = this.planck.add.sprite(100, 360, "box");
    box.setBox();
    box.setStatic();

    // Polygon
    const poly = this.planck.add.sprite(300, 328, "poly");
    poly.setPolygon([
      { x: 0, y: 64 },
      { x: 64, y: 64 },
      { x: 64, y: 0 },
    ]);
    poly.setStatic();

    // Polygon
    const polyB = this.planck.add.sprite(400, 100, "poly");
    polyB.setPolygon([
      { x: 0, y: 64 },
      { x: 64, y: 64 },
      { x: 64, y: 0 },
    ]);

    polyB.setDynamic();
    polyB.setBodyRotation(20);

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

    createGround(this);
  }

  shutdown() {
    console.log("shutdown what");
  }
}
