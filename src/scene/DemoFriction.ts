import Phaser from "phaser";
import { createGround } from "./util";

export default class DemoFriction extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoFriction" });
  }

  preload() {}

  init() {}

  create() {
    createGround(this);

    // Ramp Texture
    const rampTexture = this.add.graphics();
    rampTexture.fillStyle(0xff0000);
    rampTexture.fillRect(0, 0, 640, 1);
    rampTexture.generateTexture("demo_friction_ground", 640, 1);
    rampTexture.destroy();

    // Ramp Sprite
    const rampSprite = this.planck.add.sprite(0, 400, "demo_friction_ground");
    rampSprite.setBox();
    rampSprite.setBodyRotation(Phaser.Math.DegToRad(15));
    rampSprite.setStatic();

    // Box Texture
    const boxTexture = this.add.graphics();
    boxTexture.fillStyle(0xffffff);
    boxTexture.fillRect(0, 0, 30, 30);
    boxTexture.generateTexture("demo_friction_box", 30, 30);
    boxTexture.destroy();

    // Box Drop Timer
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const box = this.planck.add.sprite(100, 250, "demo_friction_box");
        box.setBox({
          restitution: 0,
          friction: Phaser.Math.FloatBetween(0.0, 0.9),
          density: 25.0,
        });
        box.setDynamic();
        box.setTintFill(0xcccccc);
        this.time.delayedCall(
          5000,
          () => {
            box.destroy();
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
