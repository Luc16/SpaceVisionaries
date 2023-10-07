import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

export class Satellite{
    constructor(vel, acc){
        this.vel = new THREE.Vector3(vel);
        this.acc = new THREE.Vector3(acc);

        this.object = null;

    }

    async loadModel(scene, scale, modelPath){
      const loader = new GLTFLoader();
      const giltf = await loader.loadAsync( modelPath )
      this.object = giltf.scene;
      this.object.scale.set(scale, scale, scale); 
      scene.add(this.object)

    }
}