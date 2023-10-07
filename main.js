import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { SolarSystem } from './solar_system.js';
import { Planet } from './planet.js';
import { Satellite } from './satellite_class.js';
import { Vector3 } from "three";


const updateObjects = function(satellite, mars, dt) {
	satellite.acc = mars.pos.clone()
								.sub(satellite.pos)
								.normalize()
								.multiplyScalar(1000/(satellite.pos.distanceToSquared(mars.pos)))
	
	satellite.vel.add(satellite.acc.clone().multiplyScalar(dt))

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

const setArrowToVel = function(satellite, arrow) {
	arrow.position.copy(satellite.pos.clone())
	arrow.setDirection(satellite.vel.clone().normalize())
	arrow.setLength(satellite.vel.clone().length())
}

const main = async function() {
	var simRunning = false

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const satellite = new Satellite([0, 0, 0], [0, 0, 0]);
	await satellite.loadModel(scene, 0.1, "resources/satellite/scene.gltf")
	satellite.vel = new THREE.Vector3(1, 10, 0)
	satellite.pos = new THREE.Vector3(-6, 0, 0)

	document.addEventListener('keydown', (event) => {
		var name = event.key;
		var code = event.code;
		if (event.code == 'Space') {
			simRunning = !simRunning
		}
		// Alert the key name and key code on keydown
		// alert(`Key pressed ${name} \r\n Key code value: ${code}`);
	  }, false);

	const renderer = new THREE.WebGLRenderer({ alpha: true }); 
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.getElementById("container3D").appendChild(renderer.domElement);
	camera.position.z = 5;

	var mars = new Planet(scene, 2, "resources/textures/mars_texture.jpg");
	
	const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
	topLight.position.set(100, 100, 100) //top-left-ish
	topLight.castShadow = true;
	scene.add(topLight);

	const ambientLight = new THREE.AmbientLight(0x333333, 5);
	scene.add(ambientLight);

	var arrowHelper = new THREE.ArrowHelper(satellite.vel.clone().normalize(), satellite.pos.clone(), satellite.vel.clone().length(), 0xff0000 );
	scene.add( arrowHelper );

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

		if (simRunning) {		
			updateObjects(satellite, mars, deltaTime)
			setArrowToVel(satellite, arrowHelper)
		
		}
		renderer.render(scene, camera);

	};
	
	animate();
}

await main()
