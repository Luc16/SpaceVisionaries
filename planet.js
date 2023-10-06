import * as THREE from 'three';


export class Planet{
    constructor(scene, radius, texturePath){

        //initializing material
        this.material = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(texturePath)});
            

        this.geometry = new THREE.SphereGeometry( radius, 50, 50); 
        this.sphere = new THREE.Mesh( this.geometry, this.material ); 
        scene.add( this.sphere );

    }

    translate(vec){
        this.sphere.translateX(vec[0]);
        this.sphere.translateY(vec[1]);
        this.sphere.translateZ(vec[2]);
    }


}