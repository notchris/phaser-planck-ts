import Phaser from "phaser";

export default class DemoConveyer extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: false,
    speed: 1,
    hz: 60,
  };
  constructor() {
    super({ key: "DemoConveyer" });
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

    // Ground Texture
    const conveyerTexture = this.add.graphics();
    conveyerTexture.fillStyle(0xff0000);
    conveyerTexture.fillRect(0, 0, 512, 10);
    conveyerTexture.generateTexture("demo_events_conveyer", 512, 10);
    conveyerTexture.destroy();

    // Ground Sprite
    const conveyerSprite = this.planck.add.sprite(
      200,
      300,
      "demo_events_conveyer"
    );
    conveyerSprite.setBox();
    conveyerSprite.setStatic();
    conveyerSprite.setConveyer(true, 4);
    conveyerSprite.setBodyRotation(-0.2);

    const conveyerSprite2 = this.planck.add.sprite(
      400,
      400,
      "demo_events_conveyer"
    );
    conveyerSprite2.setBox();
    conveyerSprite2.setStatic();
    conveyerSprite2.setConveyer(true, 4, true);

    // Box Texture
    const boxTexture = this.add.graphics();
    boxTexture.fillStyle(0xffffff);
    boxTexture.fillRect(0, 0, 30, 30);
    boxTexture.generateTexture("demo_events_box", 30, 30);
    boxTexture.destroy();

    // Box Drop Timer
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const box = this.planck.add.sprite(300, 100, "demo_events_box");
        box.setBox();
        box.setDynamic();
        box.setTintFill(0xcccccc);

        this.time.delayedCall(
          10000,
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
