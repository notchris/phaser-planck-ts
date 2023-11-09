import { PhaserPlanck, PhaserPlanckConfig } from ".";
declare module "phaser" {
  namespace Physics {
    export let PhaserPlanck: PhaserPlanck;
  }

  namespace Scene {
    export let PhaserPlanck: PhaserPlanck;
    export let planck: PhaserPlanck;
  }

  interface Scene {
    planck: PhaserPlanck;
    planckConfig: PhaserPlanckConfig;
  }
}
