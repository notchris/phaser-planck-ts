import GUI from "lil-gui";

export function createEdge(
  scene: Phaser.Scene,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const edgeTexture = scene.add.graphics();
  edgeTexture.lineStyle(2, 0xff0000);
  edgeTexture.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

  //@ts-ignore
  const edge = scene.planck.add.sprite(0, 0, null);
  edge.setEdge(x1, y1, x2, y2);
  return edge;
}

export function createGround(scene: Phaser.Scene) {
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

export function createGui(game: Phaser.Game): void {
  setTimeout(() => {
    const gui = new GUI();
    const scenes = game.scene.getScenes(true);
    console.log(scenes);
    const guiConfig = {
      demo: game.scene.getScenes(true)[0].constructor.name,
    };

    // GUI: Scene control
    gui
      .add(
        guiConfig,
        "demo",
        game.scene.scenes.map((scene) => scene.constructor.name)
      )
      .onChange((value: string) => {
        console.log(value);
        game.scene.getScenes(true)[0].scene.start(value);
        console.log(game.scene.getScenes(true));
      });
  }, 500);
}
