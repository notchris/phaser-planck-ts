import Phaser from "phaser";
import Sprite from "./classes/Sprite";
import { World, Vec2 } from "planck";
import PhaserPlanckSprite from "./classes/Sprite";

export interface PhaserPlanckConfig {
  scaleFactor: number;
  gravity: { x: number; y: number };
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
  constructor(
    scene: Phaser.Scene,
    pluginManager: Phaser.Plugins.PluginManager
  ) {
    super(scene, pluginManager, "PhaserPlanck");

    let scaleFactor = scene.planckConfig?.scaleFactor || 30;
    let gravity = scene.planckConfig?.gravity || { x: 0, y: 0 };
    let debug = scene.planckConfig?.debug || false;

    this.config = {
      scaleFactor,
      gravity,
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

    // Planck event bindings
    this.world.on("pre-solve", (contact) => {
      this.sprites.forEach((s) => s.preSolve(contact));
    });
    this.world.on("post-solve", (contact) => {
      this.sprites.forEach((s) => s.postSolve(contact));
    });

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

  update() {
    this.world.step(1 / 60);
    this.world.clearForces();
  }

  shutdown() {}

  destroy() {
    this.shutdown();
    //@ts-ignore
    this.scene = null;
    this.sprites = [];
  }

  register(plugins: Phaser.Plugins.PluginManager) {
    plugins.installScenePlugin("PhaserPlanck", PhaserPlanck, "PhaserPlanck");
  }
}
