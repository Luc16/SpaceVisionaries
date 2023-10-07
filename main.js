import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { SolarSystem } from './solar_system.js';

const main = function () {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const solarSystem = new SolarSystem(scene)
	solarSystem.drawOrbits(scene);

	const controls = new OrbitControls(camera, renderer.domElement);

	camera.position.z = 5;
	controls.update()

	controls.keys = {
		LEFT: 'ArrowLeft', //left arrow
		UP: 'ArrowUp', // up arrow
		RIGHT: 'ArrowRight', // right arrow
		BOTTOM: 'ArrowDown' // down arrow
	}

	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);

		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
		}
		then = now;

		controls.update()

		renderer.render(scene, camera);

	};

	animate();
}

main()