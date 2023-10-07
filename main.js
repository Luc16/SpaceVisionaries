import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { SolarSystem } from './solar_system.js';
import { Planet } from './planet.js';
import { Satellite } from './satellite_class.js';


const updateObjects = function(satellite, mars, dt) {
	satellite.acc = mars.pos.clone()
								.sub(satellite.pos)
								.normalize()
								.multiplyScalar(1000/(satellite.pos.distanceToSquared(mars.pos)))
	
	satellite.vel = satellite.acc.clone().multiplyScalar(dt)

	satellite.pos.add(satellite.vel.clone().multiplyScalar(dt))
	if (satellite.pos.distanceToSquared(mars.pos) < mars.radius*mars.radius) {
		satellite.acc = new THREE.Vector3(0, 0, 0)
		satellite.vel = new THREE.Vector3(0, 0, 0)
		satellite.pos = mars.pos.clone()
			.sub(satellite.pos)
			.normalize()
			.multiplyScalar(-(mars.radius))
	}
}

const main = async function() {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const satellite = new Satellite([0, 0, 0], [0, 0, 0]);
	await satellite.loadModel(scene, 0.1, "resources/satellite/scene.gltf")
	satellite.object.position.x -= 6

	const renderer = new THREE.WebGLRenderer({ alpha: true }); 
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.getElementById("container3D").appendChild(renderer.domElement);
	camera.position.z = 5;

	var mars = new Planet(scene, 2, "resources/textures/mars_texture.jpg");
	mars.translate([0, 0, 0])
	
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


		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
		}
		then = now;

		updateObjects(satellite, mars, deltaTime)

		renderer.render(scene, camera);

	};
	
	animate();
}

await main()
