import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

export class Satellite{
    constructor(vel, acc, scale, resetPos, resetVel){
        this.resetPos = resetPos
        this.resetVel = resetVel
        this.velocity = vel;
        this.acc = acc;
        this.scale = scale;
        this.object = null;
        this.view_target  = new THREE.Object3D;
        this.view_follow  = new THREE.Object3D;
    }

    set scl(scale) {
      this.scale = scale
      this.object.scale.set(this.scale, this.scale, this.scale); 
    }

    get scl() {
      return this.scale
    }

    async loadModel(scene, modelPath){
      const loader = new GLTFLoader();
      const giltf = await loader.loadAsync( modelPath )
      this.object = giltf.scene;
      this.object.scale.set(this.scale, this.scale, this.scale); 
      scene.add(this.object)

    }

    get pos() {
      return this.object.position
    }

    set pos(vec) {
      this.object.position.x = vec.x
      this.object.position.y = vec.y
      this.object.position.z = vec.z
    }

    get vel() {
      return this.velocity
    }

    set vel(vec) {
      this.velocity.x = vec.x
      this.velocity.y = vec.y
      this.velocity.z = vec.z
    }
}
