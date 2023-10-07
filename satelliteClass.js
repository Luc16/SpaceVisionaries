import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { VectorImpl } from "./VectorImpl";
export class SatelliteModel{
    constructor(scene, posx, posy, posz, velx, vely, velz, ax=0, ay=0, az=0){
        this.pos = new VectorImpl(posx, posy, posz);
        this.vel = new VectorImpl(velx, vely, velz);
        this.acc = new VectorImpl(ax, ay, az);

        var object;

        const loader = new GLTFLoader();
        loader.load(
            `resources/satellite/scene.gltf`,
            function (gltf) {
              //If the file is loaded, add it to the scene
              object = gltf.scene;
              scene.add(object);
            },
            function (xhr) {
              //While it is loading, log the progress
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
              //If there is an error, log it
              console.error(error);
            }
          );
        
    }
}