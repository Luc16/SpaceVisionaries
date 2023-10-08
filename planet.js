import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";

export class Planet {
    constructor(document, scene, orbit, name, mass, radius, texturePath, v){
        this.name = name;
        this.orbit = orbit;
        this.radius = radius;
        this.mass = mass
        //initializing material
        this.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texturePath) });

        this.geometry = new THREE.SphereGeometry(radius, 50, 50);
        this.sphere = new THREE.Mesh(this.geometry, this.material);

        const p = document.createElement('p');
        p.textContent = name;
        const nameLabel = new CSS2DObject(p);
        this.sphere.add(nameLabel);

        scene.add(this.sphere);

        this.v = v;
        this.orbitComplete = 0;
    }

    translate(vec) {
        this.sphere.translateX(vec[0]);
        this.sphere.translateY(vec[1]);
        this.sphere.translateZ(vec[2]);
    }

    getMesh() {
        return this.sphere;
    }

    movePlanet(time) {

        let oldPosition = this.pos.toArray();
        let newPosition = this.orbit.getPoint(this.orbitComplete).toArray();
        this.translate([newPosition[0] - oldPosition[0], oldPosition[1], newPosition[1] - oldPosition[2]]);
        // console.log(newPosition);
        const T = 1/this.v;
        this.orbitComplete = (time*60 - T*Math.floor(time*60/T))*this.v;

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