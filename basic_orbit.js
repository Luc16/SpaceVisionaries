import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";


export class BasicOrbit{
    constructor(scene, radiusA, radiusB, positionX, positionY, color, rotation=0){

        this.path = new THREE.EllipseCurve(positionX, positionY, radiusA, radiusB, 0, 2*Math.PI, false, rotation);
        this.path.arcLengthDivisions = 8000;
        this.points = this.path.getPoints(8000);
        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        const material = new THREE.LineBasicMaterial({ color: color });
        this.originalColor = color
        this.orbitLine = new THREE.Line(geometry, material);
        this.orbitLine.rotateX(Math.PI/2 + rotation);
        this.orbitLine.renderOrder = 1000;
        scene.add(this.orbitLine);
    }

    getPoint(t, vector) {
        this.path.getPoint(t, vector);
    }

    getLine() {
        return this.orbitLine
    }
}