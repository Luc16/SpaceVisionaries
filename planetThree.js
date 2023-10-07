import * as THREE from 'three'; 

export class PlanetThree{
    constructor(scene, radius, texturePath){

        //initialization
        const loader = new THREE.TextureLoader();

        //loading texture
        this.texture = loader.load (texturePath)

        //initializing material
        const material = new THREE.MeshPhongMaterial();

        //setting material property
        material.map = this.texture;

        this.geometry = new THREE.SphereGeometry( radius, 64, 32); 
        this.sphere = new THREE.Mesh( this.geometry, material ); 
        scene.add( this.sphere );
    }
}