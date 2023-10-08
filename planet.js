import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { BasicOrbit } from './basic_orbit.js';

export class Planet{
    constructor(document, scene, orbit, name, mass, radius, texturePath, v){

        this.name = name
        this.orbit = orbit
    
        //initializing material
        this.material = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(texturePath)});
            

        this.geometry = new THREE.SphereGeometry( radius, 50, 50); 
        this.sphere = new THREE.Mesh( this.geometry, this.material ); 
        this.radius = radius
        this.mass = mass
        scene.add( this.sphere );
        
        this.v = v;
        this.orbitComplete = 0;
    }

    translate(vec){
        this.sphere.translateX(vec[0]);
        this.sphere.translateY(vec[1]);
        this.sphere.translateZ(vec[2]);
        return this
    }

    getMesh() {
        return this.sphere;
    }

    movePlanet(time) {

        let oldPosition = this.getPosition().toArray();
        // let newPosition = this.orbit.getPoint(this.orbitComplete).toArray();
        // this.translate([newPosition[0] - oldPosition[0], oldPosition[1], newPosition[1] - oldPosition[2]]);
        // console.log(newPosition);
        // const T = 1/this.v;
        // this.orbitComplete = (time*60 - T*Math.floor(time*60/T))*this.v;

    }
  
    get pos() {
        return this.sphere.position
    }

    set pos(vec) {
        this.sphere.position.x = vec.x
        this.sphere.position.y = vec.y
        this.sphere.position.z = vec.z
    }

}
