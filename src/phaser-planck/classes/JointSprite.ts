import { Joint } from "planck";

export default class PhaserPlanckJoint extends Phaser.GameObjects.GameObject {
  debug: boolean;
  joint: Joint;
  graphics: Phaser.GameObjects.Graphics;
  constructor(scene: Phaser.Scene, joint: Joint) {
    super(scene, "sprite");
    this.scene = scene;
    this.debug = scene?.planckConfig?.debug || false;
    this.joint = joint;
    this.graphics = scene.add.graphics();

    this.scene.add.existing(this);
  }

  preDestroy() {
    console.log("Joint sprite destroyed");
    this.graphics.destroy();
  }

  preUpdate() {
    if (!this.debug) return;
    this.graphics.clear();
    this.graphics.beginPath();

    switch (this.joint.getType()) {
      case "distance-joint":
        this.graphics.lineStyle(2, 0xffff00);
        const { x: x1, y: y1 } = this.joint.getAnchorA();
        const { x: x2, y: y2 } = this.joint.getAnchorB();
        const scale = this.scene.planckConfig.scaleFactor;
        this.graphics.strokePoints([
          { x: x1 * scale, y: y1 * scale },
          { x: x2 * scale, y: y2 * scale },
        ]);
        break;
      case "revolute-joint":
        break;
      default:
        break;
    }
  }
}
