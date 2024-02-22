import Phaser from "phaser";
import { createGround } from "./util";
import JointSprite from "../phaser-planck/classes/JointSprite";
import { WheelJoint } from "planck";

export default class DemoSandbox extends Phaser.Scene {
  planckConfig = {
    scaleFactor: 30,
    gravity: { x: 0, y: 9 },
    debug: true,
    speed: 1.3,
    hz: 50,
  };

  keyLeft!: Phaser.Input.Keyboard.Key;
  keyRight!: Phaser.Input.Keyboard.Key;
  springBack!: JointSprite;
  springFront!: JointSprite;

  // wheel spring settings
  HZ = 4.0;
  ZETA = 0.7;
  SPEED = 50.0;

  constructor() {
    super({ key: "DemoSandbox" });
  }

  preload() {}

  init() {}

  create() {
    const { width, height } = this.game.canvas;

    this.keyLeft = (
      this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin
    ).addKey("A");
    this.keyRight = (
      this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin
    ).addKey("D");

    // Box Texture
    const boxTexture = this.add.graphics();
    boxTexture.fillStyle(0xffff00);
    boxTexture.fillRect(0, 0, 200, 30);
    boxTexture.generateTexture("demo_sandbox_box", 200, 30);
    boxTexture.destroy();

    // circle Texture
    const circleTexture = this.add.graphics();
    circleTexture.fillStyle(0xffffff);
    circleTexture.fillCircle(30, 30, 30);
    circleTexture.generateTexture("demo_sandbox_circle", 60, 60);
    circleTexture.destroy();

    // Ramp Texture
    const rampTexture = this.add.graphics();
    rampTexture.fillStyle(0xffff00);
    rampTexture.fillRect(0, 0, 400, 10);
    rampTexture.generateTexture("demo_sandbox_ramp", 400, 10);
    rampTexture.destroy();

    const ramp = this.planck.add.sprite(
      width / 2 - 100,
      height / 2 + 260,
      "demo_sandbox_ramp"
    );
    ramp.setBox();
    ramp.setBodyRotation(-Math.PI / 16);

    // Car
    const car = this.planck.add.sprite(
      width / 2 - 100,
      height / 2 - 15,
      "demo_sandbox_box"
    );
    car.setBox({
      density: 0.4,
    });
    car.setDynamic();
    car.setTintFill(0xff0000);

    // Wheel Back
    const wheelBack = this.planck.add.sprite(
      width / 2 - 50,
      height / 2,
      "demo_sandbox_circle"
    );
    wheelBack.setCircle({
      density: 0.2,
      friction: 0.9,
    });
    wheelBack.setDynamic();
    wheelBack.setTintFill(0xffff00);

    // Wheel Front
    const wheelFront = this.planck.add.sprite(
      width / 2 + 50,
      height / 2,
      "demo_sandbox_circle"
    );
    wheelFront.setCircle({
      density: 0.2,
      friction: 0.9,
    });
    wheelFront.setDynamic();
    wheelFront.setTintFill(0xffff00);

    // Spring Back
    this.springBack = this.planck.add.wheelJoint(
      car,
      wheelBack,
      wheelBack.getBodyWorldCenter(),
      { x: 0, y: 1.0 },
      {
        // collideConnected: true,
        motorSpeed: 0.0,
        maxMotorTorque: 20.0,
        enableMotor: true,
        frequencyHz: this.HZ,
        dampingRatio: this.ZETA,
      }
    );

    // Spring Front
    this.springFront = this.planck.add.wheelJoint(
      car,
      wheelFront,
      wheelFront.getBodyWorldCenter(),
      { x: 0, y: 1.0 },
      {
        // collideConnected: true,
        motorSpeed: 0.0,
        maxMotorTorque: 10.0,
        enableMotor: false,
        frequencyHz: this.HZ,
        dampingRatio: this.ZETA,
      }
    );

    const ground = createGround(this);

    this.cameras.main.startFollow(car);
  }

  update(): void {
    const joint = this.springBack.joint as WheelJoint;
    if (this.keyRight.isDown && this.keyLeft.isDown) {
      joint.setMotorSpeed(0);
      joint.enableMotor(true);
    } else if (this.keyRight.isDown) {
      joint.setMotorSpeed(+this.SPEED);
      joint.enableMotor(true);
    } else if (this.keyLeft.isDown) {
      console.log("right");
      joint.setMotorSpeed(-this.SPEED);
      joint.enableMotor(true);
    } else {
      joint.setMotorSpeed(0);
      joint.enableMotor(false);
    }
  }

  shutdown() {
    console.log("shutdown what");
  }
}
