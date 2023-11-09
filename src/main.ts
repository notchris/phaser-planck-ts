import "./style.css";
import "phaser";
import MainScene from "./scene/MainScene";
import { PhaserPlanck } from "./phaser-planck";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const config = {
  type: Phaser.WEBGL,
  backgroundColor: "#000000",
  scale: {
    parent: "app",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  audio: {
    noAudio: true,
  },
  scene: [MainScene],
  plugins: {
    scene: [{ key: "PhaserPlanck", plugin: PhaserPlanck, mapping: "planck" }],
  },
};

window.addEventListener("load", () => {
  new Phaser.Game(config);
});
