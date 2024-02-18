import Phaser from "phaser";
import Sprite from "./classes/Sprite";
import { World, Vec2 } from "planck";
import PhaserPlanckSprite from "./classes/Sprite";

export interface PhaserPlanckConfig {
  scaleFactor: number;
  gravity: { x: number; y: number };
  speed: number;
  hz: number;
  debug: boolean;
}

export class PhaserPlanck extends Phaser.Plugins.ScenePlugin {
  world: World;
  add: {
    sprite: (x: number, y: number, texture: string) => PhaserPlanckSprite;
  };
  scene: Phaser.Scene;
  sprites: PhaserPlanckSprite[];
  config: PhaserPlanckConfig;

  timeStep: number;
  elapsedTime: number = 0;
  errored: boolean = false;
  constructor(
    scene: Phaser.Scene,
    pluginManager: Phaser.Plugins.PluginManager
  ) {
    super(scene, pluginManager, "PhaserPlanck");

    let scaleFactor = scene.planckConfig?.scaleFactor || 30;
    let gravity = scene.planckConfig?.gravity || { x: 0, y: 0 };
    let speed = scene.planckConfig?.speed || 1;
    let hz = scene.planckConfig?.hz || 60;
    let debug = scene.planckConfig?.debug || false;

    // Prevent negative hz
    if (Math.abs(hz) < 1) {
      hz = 1 / hz;
    }

    this.timeStep = 1 / hz;
    this.elapsedTime = 0;
    this.errored = false;

    this.config = {
      scaleFactor,
      gravity,
      speed,
      hz,
      debug,
    };

    Phaser.Physics.PhaserPlanck = this;
    this.scene = scene;
    this.world = new World(Vec2(this.config.gravity.x, this.config.gravity.y));
    this.sprites = [];

    scene.planck = this;

    if (!scene.sys.settings.isBooted) {
      scene.sys.events.once("boot", this.boot, this);
    }

    // Creates a sprite with an empty Planck body
    this.add = {
      sprite: (x, y, texture) => {
        const s = new Sprite(this.scene, x, y, texture);
        this.sprites.push(s);
        return s;
      },
    };

    //// Planck event bindings

    // Pre-solve
    this.world.on("pre-solve", (contact) => {
      this.sprites.forEach((s) => s.preSolve(contact));
    });

    // Post-solve
    this.world.on("post-solve", (contact) => {
      this.sprites.forEach((s) => s.postSolve(contact));
    });

    // Begin contact
    this.world.on("begin-contact", (contact) => {
      const a = this.sprites.filter(
        (s) => s.fixture === contact.getFixtureA()
      )[0];
      const b = this.sprites.filter(
        (s) => s.fixture === contact.getFixtureB()
      )[0];
      a.emit("collision-start", b);
      b.emit("collision-start", a);
    });

    // End contact
    this.world.on("end-contact", (contact) => {
      const a = this.sprites.filter(
        (s) => s.fixture === contact.getFixtureA()
      )[0];
      const b = this.sprites.filter(
        (s) => s.fixture === contact.getFixtureB()
      )[0];
      a.emit("collision-end", b);
      b.emit("collision-end", a);
    });
  }

  boot() {
    const eventEmitter = this.systems?.events;
    if (eventEmitter) {
      eventEmitter.on("update", this.update, this);
      eventEmitter.on("postupdate", this.postUpdate, this);
      eventEmitter.on("shutdown", this.shutdown, this);
      eventEmitter.on("destroy", this.destroy, this);
    } else {
      throw new Error("Unable to get reference to Scene systems.");
    }
  }

  postUpdate() {}

  update(_time: number, dt: number) {
    if (this.errored) {
      return false;
    }
    try {
      dt = dt * 0.001 * this.config.speed;
      this.elapsedTime += dt;
      while (this.elapsedTime > this.timeStep) {
        this.world.step(this.timeStep);
        this.elapsedTime -= this.timeStep;
        this.world.clearForces();
      }
      return true;
    } catch (error) {
      this.errored = true;
      console.error(error);
      return false;
    }
  }

  shutdown() {}

  destroy() {
    this.shutdown();

    //@ts-ignore
    this.scene = null;
    this.sprites = [];
    this.elapsedTime = 0;
    this.errored = false
  }

  register(plugins: Phaser.Plugins.PluginManager) {
    plugins.installScenePlugin("PhaserPlanck", PhaserPlanck, "PhaserPlanck");
  }
}
