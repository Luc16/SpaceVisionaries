import * as THREE from 'three';


export class BasicOrbit{
    constructor(scene, radiusA, radiusB, positionX, positionY){
        const path = new THREE.Path();
        path.ellipse(positionX, positionY, radiusA, radiusB, 0, Math.PI / 2, false);
        path.ellipse(0, -radiusB, radiusA, radiusB, Math.PI / 2, Math.PI, false);
        path.ellipse(radiusA, 0, radiusA, radiusB, Math.PI, 3 * Math.PI / 2, false);
        path.ellipse(0, radiusB, radiusA, radiusB, 3 * Math.PI / 2, 2 * Math.PI, false);
        const points = path.getPoints();
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const orbit = new THREE.Line(geometry, material);
        orbit.rotateX(Math.PI/2);
        orbit.renderOrder = 1000;
        scene.add(orbit);
    }
}