import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

export class Trail {
    constructor(scene, size, color) {
        this.size = 100
        this.points = [];
        this.lineGeometry = new THREE.BufferGeometry().setFromPoints( this.points );
        const lineMaterial = new THREE.LineBasicMaterial({
            color: color
        });
        const line = new THREE.Line( this.lineGeometry, lineMaterial );
	    scene.add( line );
    }


    reset() {
        this.points = []
		this.lineGeometry.setFromPoints( this.points );
    }

    add(pos) {
        if (this.points.length >= this.size) {
            this.points.splice(0, 1)
        }
        this.points.push(pos)    

        this.lineGeometry.setFromPoints( this.points );
    }
}