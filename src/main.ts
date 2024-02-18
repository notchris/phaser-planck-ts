import "./style.css";
import "phaser";
import DemoShapes from "./scene/DemoShapes";
import DemoEdges from "./scene/DemoEdges";
import { PhaserPlanck } from "./phaser-planck";
import DemoEvents from "./scene/DemoEvents";
import { createGui } from "./scene/util";
import DemoConveyer from "./scene/DemoConveyer";
import DemoForce from "./scene/DemoForce";

// Create reference to 'game' to be set onload
let game: Phaser.Game | undefined;
const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;

const config = {
  type: Phaser.WEBGL,
  backgroundColor: "#000000",
  scale: {
    parent: "app",
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  audio: {
    noAudio: true,
  },
  scene: [DemoShapes, DemoEdges, DemoEvents, DemoConveyer, DemoForce],
  plugins: {
    scene: [{ key: "PhaserPlanck", plugin: PhaserPlanck, mapping: "planck" }],
  },
  render: {
    antialias: true,
  },
};

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
  createGui(game);
});
