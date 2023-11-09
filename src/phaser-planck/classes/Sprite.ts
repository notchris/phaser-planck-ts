import Phaser from "phaser";
import {
  Vec2,
  Fixture,
  Body,
  Box,
  Circle,
  Edge,
  Polygon,
  Contact,
} from "planck";

interface PhaserPlanckSpriteOptions {
  friction?: number;
  restitution?: number;
  density?: number;
  mass?: number;
  massCenter?: Vec2;
  inertia?: number;
}

export default class PhaserPlanckSprite extends Phaser.GameObjects.Sprite {
  debug: boolean;
  fixture?: Fixture;
  planckBody?: Body;
  bodyType?: "box" | "circle" | "polygon" | "edge";
  graphics: Phaser.GameObjects.Graphics;
  fixtureOptions?: PhaserPlanckSpriteOptions;
  conveyer = false;
  conveyerSpeed = 0;
  sensor = false;
  vertices: Vec2[] = [];
  points: { x: number; y: number }[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.debug = scene?.planckConfig?.debug || false;

    if (texture) {
      this.setTexture(texture);
    } else {
      this.setVisible(false);
    }

    this.x = x;
    this.y = y;
    this.scene.add.existing(this);

    this.graphics = this.scene.add.graphics();

    return this;
  }

  setMassData(options: PhaserPlanckSpriteOptions) {
    if (!this.planckBody) {
      console.error("No planck body on Sprite.");
      return;
    }
    this.planckBody.setMassData({
      mass: options.mass || 1,
      center: options.massCenter || Vec2(),
      I: options.inertia || 1,
    });
  }

  setFixtureData(options: PhaserPlanckSpriteOptions) {
    return {
      friction: options.friction || 1.0,
      restitution: options.restitution || 0.0,
      density: options.density || 1.0,
    };
  }

  setBox(options?: PhaserPlanckSpriteOptions) {
    this.bodyType = "box";
    this.planckBody = this.scene.planck.world.createBody();
    this.setMassData(options || {});
    const fixtureOptions = this.setFixtureData(options || {});

    this.fixture = this.planckBody.createFixture(
      Box(
        this.displayWidth / 2 / this.scene.planck.config.scaleFactor,
        this.displayHeight / 2 / this.scene.planck.config.scaleFactor
      ),
      fixtureOptions
    );
    this.planckBody.setPosition(
      Vec2(
        (this.x + this.displayWidth / 2) / this.scene.planck.config.scaleFactor,
        (this.y - this.displayHeight / 2) / this.scene.planck.config.scaleFactor
      )
    );
  }

  setCircle(options?: PhaserPlanckSpriteOptions) {
    this.bodyType = "circle";
    this.planckBody = this.scene.planck.world.createBody();
    this.setMassData(options || {});
    const fixtureOptions = this.setFixtureData(options || {});

    this.fixture = this.planckBody.createFixture(
      Circle(this.displayWidth / 2 / this.scene.planck.config.scaleFactor),
      fixtureOptions
    );
    this.planckBody.setPosition(
      Vec2(
        this.x / this.scene.planck.config.scaleFactor,
        this.y / this.scene.planck.config.scaleFactor
      )
    );
  }

  setPolygon(
    points: { x: number; y: number }[],
    options?: PhaserPlanckSpriteOptions
  ) {
    this.bodyType = "polygon";
    this.planckBody = this.scene.planck.world.createBody();
    this.setMassData(options || {});
    const fixtureOptions = this.setFixtureData(options || {});

    points.forEach((p) => {
      this.vertices.push(
        Vec2(
          (p.x - this.displayWidth / 2) / this.scene.planck.config.scaleFactor,
          (p.y - this.displayHeight / 2) / this.scene.planck.config.scaleFactor
        )
      );
      this.points.push({
        x: p.x - this.displayWidth / 2,
        y: p.y - this.displayHeight / 2,
      });
    });
    this.fixture = this.planckBody.createFixture(
      Polygon(this.vertices),
      fixtureOptions
    );
    this.planckBody.setPosition(
      Vec2(
        this.x / this.scene.planck.config.scaleFactor,
        this.y / this.scene.planck.config.scaleFactor
      )
    );
  }

  setEdge(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: PhaserPlanckSpriteOptions
  ) {
    this.bodyType = "edge";
    this.planckBody = this.scene.planck.world.createBody();
    this.setMassData(options || {});
    const fixtureOptions = this.setFixtureData(options || {});

    this.fixture = this.planckBody.createFixture(
      Edge(
        Vec2(
          x1 / this.scene.planck.config.scaleFactor,
          y1 / this.scene.planck.config.scaleFactor
        ),
        Vec2(
          x2 / this.scene.planck.config.scaleFactor,
          y2 / this.scene.planck.config.scaleFactor
        )
      ),
      fixtureOptions
    );
    this.planckBody.setStatic();
  }

  setConveyer(bool: boolean, speed: number) {
    this.conveyer = bool;
    this.conveyerSpeed = speed || 0;
  }

  setBodyPosition(x: number, y: number) {
    if (!this.planckBody) return;
    this.planckBody.setTransform(
      Vec2(
        x / this.scene.planck.config.scaleFactor,
        y / this.scene.planck.config.scaleFactor
      ),
      this.planckBody.getAngle()
    );
  }

  getBodyPosition() {
    if (!this.planckBody) return;
    return new Phaser.Math.Vector2(this.x, this.y);
  }

  setBodyRotation(angle: number) {
    if (!this.planckBody) return;
    this.planckBody.setTransform(this.planckBody.getPosition(), angle);
  }

  getBodyRotation() {
    if (!this.planckBody) return;
    return this.planckBody.getAngle();
  }

  setStatic() {
    if (!this.planckBody) return;
    this.planckBody.setStatic();
  }

  setDynamic() {
    if (!this.planckBody) return;
    this.planckBody.setDynamic();
  }

  setSensor() {
    if (!this.fixture) return;
    this.fixture.setSensor(true);
  }

  isSensor() {
    if (!this.fixture) return false;
    return this.fixture.isSensor();
  }

  /**
   * Custom debug draw
   * Note: This should really be replaced with a shader or something.
   */
  // drawDebug() {

  //   this.graphics.clear();
  //   this.graphics.lineStyle(2, 0x0000ff, 1);
  //   switch (this.bodyType) {
  //     case "box":
  //       this.graphics.translateCanvas(this.x, this.y);
  //       this.graphics.rotateCanvas(this.rotation);
  //       this.graphics.strokeRect(
  //         -this.displayWidth / 2,
  //         -this.displayHeight / 2,
  //         this.displayWidth,
  //         this.displayHeight
  //       );
  //       break;
  //     case "circle":
  //       this.graphics.translateCanvas(this.x, this.y);
  //       this.graphics.rotateCanvas(this.rotation);
  //       this.graphics.strokeCircle(0, 0, this.displayWidth / 2);
  //       break;
  //     case "polygon":
  //       this.graphics.translateCanvas(this.x, this.y);
  //       this.graphics.rotateCanvas(this.rotation);
  //       this.graphics.strokePoints(this.points, true, true);
  //       break;
  //     case "edge":
  //       this.graphics.strokeLineShape({
  //         x1: this.opts.x1,
  //         y1: this.opts.y1,
  //         x2: this.opts.x2,
  //         y2: this.opts.y2,
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }

  /**
   * PreSolve Planck World
   */
  preSolve(contact: Contact) {
    // Conveyer
    if (this.conveyer) {
      let fixtureA = contact.getFixtureA();
      let fixtureB = contact.getFixtureB();
      if (fixtureA === this.fixture) {
        contact.setTangentSpeed(-this.conveyerSpeed);
      }
      if (fixtureB === this.fixture) {
        contact.setTangentSpeed(this.conveyerSpeed);
      }
    }
  }

  /**
   * PostSolve Planck World
   * TODO
   */
  //@ts-ignore
  postSolve(contact: Contact) {}

  /**
   * PreDestroy / PreUpdate Methods
   */

  preDestroy() {
    if (this.planckBody && this.graphics) {
      this.planckBody && this.scene.planck.world.destroyBody(this.planckBody);
      this.graphics.destroy();
      this.scene.planck.sprites.forEach((sprite, i) => {
        if (sprite === this) {
          this.scene.planck.sprites.splice(i, 1);
        }
      });
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.planckBody) {
      let pb = this.planckBody;
      let pos = pb.getPosition();
      this.x = pos.x * this.scene.planck.config.scaleFactor;
      this.y = pos.y * this.scene.planck.config.scaleFactor;
      this.rotation = pb.getAngle();
      // if (this.debug) {
      //   this.drawDebug();
      // }
    }
  }
}
