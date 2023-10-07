import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";


export class Planet{
    constructor(scene, radius, texturePath, v){

        //initializing material
        this.material = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(texturePath)});
            

        this.geometry = new THREE.SphereGeometry( radius, 50, 50); 
        this.sphere = new THREE.Mesh( this.geometry, this.material ); 
        scene.add( this.sphere );

        this.v = v;
        this.orbitComplete = 0;
    }

    translate(vec){
        this.sphere.translateX(vec[0]);
        this.sphere.translateY(vec[1]);
        this.sphere.translateZ(vec[2]);
    }

    getMesh(){
        return this.sphere;
    }

    movePlanet(orbit) {
       
        let oldPosition = this.getPosition().toArray();
        let newPosition = orbit.getPoint(this.orbitComplete).toArray();
        this.translate([newPosition[0] - oldPosition[0], oldPosition[1], newPosition[1] - oldPosition[2]]);
        // console.log(newPosition);
        this.orbitComplete += this.v;

        if (this.orbitComplete >= 1) {
            this.orbitComplete = 0;
        }
    }

    getPosition() {
        return this.sphere.position;
    }

}