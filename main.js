import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { SolarSystem } from './solar_system.js';
import { Satellite } from './satellite_class.js';

const main = async function() {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const satellite = new Satellite([0, 0, 0], [0, 0, 0]);
	await satellite.loadModel(scene, 0.1, "resources/satellite/scene.gltf")
	const renderer = new THREE.WebGLRenderer({ alpha: true }); 
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.getElementById("container3D").appendChild(renderer.domElement);
	camera.position.z = 5;

	
	const solarSystem = new SolarSystem(scene)

	const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
	topLight.position.set(100, 100, 100) //top-left-ish
	topLight.castShadow = true;
	scene.add(topLight);

	const ambientLight = new THREE.AmbientLight(0x333333, 5);
	scene.add(ambientLight);

	var controls = new OrbitControls(camera, renderer.domElement);

	window.addEventListener("resize", function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	  });

	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);
		satellite.object.position.x -= 0.01


		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
		}
		then = now;

		renderer.render(scene, camera);

	};
	
	animate();
}

await main()
