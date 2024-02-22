import GUI from "lil-gui";
import { PhaserPlanckSpriteOptions } from "../phaser-planck/classes/Sprite";

export function createEdge(
  scene: Phaser.Scene,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: PhaserPlanckSpriteOptions
) {
  const edgeTexture = scene.add.graphics();
  edgeTexture.lineStyle(2, 0xff0000);
  edgeTexture.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

  //@ts-ignore
  const edge = scene.planck.add.sprite(0, 0, null);
  edge.setEdge(x1, y1, x2, y2, options);
  return edge;
}

export function createRamps(scene: Phaser.Scene) {
  const arr = [
    [128.01, 2.5, 256.01, 130.5],
    [384.01, 258.5, 256.01, 130.5],
    [384.01, 258.5, 640.01, 258.5],
    [768.01, 130.5, 640.01, 258.5],
    [896.01, 2.5, 768.01, 130.5],
    [0, 0.5, 128.01, 2.5],
    [896.01, 2.5, 1024.01, 2.5],
  ];

  arr.forEach((points) => {
    const [x1, y1, x2, y2] = points;
    createEdge(scene, x1, y1 + 384, x2, y2 + 384);
  });
}

export function createGround(scene: Phaser.Scene) {
  const x2 = scene.game.canvas.width * 4;
  const y = scene.game.canvas.height - 100;
  return createEdge(scene, 0, y, x2, y, {
    friction: 0.6,
    density: 0.0,
  });
}

export function createGui(game: Phaser.Game): void {
  setTimeout(() => {
    const gui = new GUI();
    const guiConfig = {
      demo: game.scene.getScenes(true)[0].constructor.name,
      reset: () => {
        game.scene.getScenes(true)[0].scene.restart();
      },
    };
    // GUI: Scene control
    gui
      .add(
        guiConfig,
        "demo",
        game.scene.scenes.map((scene) => scene.constructor.name)
      )
      .onChange((value: string) => {
        game.scene.getScenes(true)[0].scene.start(value);
      });
    gui.add(guiConfig, "reset");
  }, 500);
}
