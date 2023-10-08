import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";


export class BasicOrbit{
    constructor(scene, radiusA, radiusB, positionX, positionY, color){
        this.path = new THREE.Path();
        this.path.arcLengthDivisions = 2000;
        this.path.ellipse(positionX, positionY, radiusA, radiusB, 0, Math.PI / 2, false);
        this.path.ellipse(0, -radiusB, radiusA, radiusB, Math.PI / 2, Math.PI, false);
        this.path.ellipse(radiusA, 0, radiusA, radiusB, Math.PI, 3 * Math.PI / 2, false);
        this.path.ellipse(0, radiusB, radiusA, radiusB, 3 * Math.PI / 2, 2 * Math.PI, false);
        this.points = this.path.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        const material = new THREE.LineBasicMaterial({ color: color });
        this.originalColor = color
        this.orbitLine = new THREE.Line(geometry, material);
        this.orbitLine.rotateX(Math.PI/2);
        this.orbitLine.renderOrder = 1000;
        scene.add(this.orbitLine);
    }

    getPoint(t) {
        return this.path.getPoint(t);
    }
}