import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { VectorImpl } from "./VectorImpl";
export class SatelliteModel{
    constructor(scene, posx, posy, posz, velx, vely, velz, ax=0, ay=0, az=0){
        this.pos = new VectorImpl(posx, posy, posz);
        this.vel = new VectorImpl(velx, vely, velz);
        this.acc = new VectorImpl(ax, ay, az);

        this.object = null;

    }

    async loadModel(scene, modelPath){
      const loader = new GLTFLoader();
      const giltf = await loader.loadAsync( modelPath )
      this.object = giltf.scene;
      scene.add(this.object)

    }
}