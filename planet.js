import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

export class Planet{
    constructor(scene, radius, texturePath){

        //initializing material
        this.material = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(texturePath)});
            

        this.geometry = new THREE.SphereGeometry( radius, 50, 50); 
        this.sphere = new THREE.Mesh( this.geometry, this.material ); 
        this.radius = radius
        scene.add( this.sphere );

    }

    translate(vec){
        this.sphere.translateX(vec[0]);
        this.sphere.translateY(vec[1]);
        this.sphere.translateZ(vec[2]);
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