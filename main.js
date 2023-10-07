import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { SolarSystem } from './solar_system.js';
import { Planet } from './planet.js';
import { Satellite } from './satellite_class.js';
import { Vector3 } from "three";

import { GUI } from 'dat.gui';
import { Trail } from "./trail.js";


const updateObjects = function(satellite, planets, dt) {
	for (const planet of planets) {
		satellite.acc.add(
			planet.pos.clone()
			.sub(satellite.pos)
			.normalize()
			.multiplyScalar(50*planet.mass/(satellite.pos.distanceToSquared(planet.pos)))
		)
	}
	
	satellite.vel.add(satellite.acc.clone().multiplyScalar(dt))

	satellite.pos.add(satellite.vel.clone().multiplyScalar(dt))

	for (const planet of planets) {
		if (satellite.pos.distanceToSquared(planet.pos) <= planet.radius*planet.radius) {
			satellite.acc = new THREE.Vector3(0, 0, 0)
			satellite.vel = new THREE.Vector3(0, 0, 0)
			satellite.pos = planet.pos.clone().add(planet.pos.clone()
				.sub(satellite.pos)
				.normalize()
				.multiplyScalar(-(planet.radius)))
		}
	}
	
	
}

const setArrowToVel = function(satellite, arrow) {
	arrow.position.copy(satellite.pos.clone())
	arrow.setDirection(satellite.vel.clone().normalize())
	arrow.setLength(satellite.vel.clone().length()/10)
}

const resetSatellite = function (satellite, resetPos, resetVel) {
	satellite.vel = resetVel.clone()
	satellite.pos = resetPos.clone()
	satellite.acc = new THREE.Vector3(0, 0, 0)
}

const main = async function() {
	var simRunning = false

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const satellite = new Satellite([0, 0, 0], [0, 0, 0], 0.1);
	await satellite.loadModel(scene, "resources/satellite/scene.gltf")
	
	var resetPos = new THREE.Vector3(-6, 0, 0)
	var resetVel = new THREE.Vector3(1, 10, 0)
	resetSatellite(satellite, resetPos, resetVel);

	const gui = new GUI()
	gui.add(satellite, "scl", 0, 1, 0.01).name("Scale").listen()

	gui.add(satellite.pos, "x", -50, 50, 0.01).name("Position X").listen()
	gui.add(satellite.pos, "y", -50, 50, 0.01).name("Position Y").listen()
	gui.add(satellite.pos, "z", -50, 50, 0.01).name("Position Z").listen()

	gui.add(satellite.vel, "x", -50, 50, 0.01).name("Velocity X").listen()
	gui.add(satellite.vel, "y", -50, 50, 0.01).name("Velocity Y").listen()
	gui.add(satellite.vel, "z", -50, 50, 0.01).name("Velocity Z").listen()


	window.onblur = function(ev){
		simRunning = false;
	}

	window.onfocus = function(ev){
		simRunning = true;
	}

	const trail = new Trail(scene, 100, 0x0000ff)

	document.addEventListener('keydown', (event) => {
		if (event.code == 'Space') {
			if (!simRunning){
				resetVel = satellite.vel.clone()
			}
			simRunning = !simRunning
		} 
		else if (event.key == 'r') {
			trail.reset()
			resetSatellite(satellite, resetPos, resetVel)
			simRunning = false
		}
	
	}, false);

	const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.getElementById("container3D").appendChild(renderer.domElement);
	camera.position.z = 10;
	

	const planets = [
		new Planet(scene, 1, 2, "resources/textures/mars_texture.jpg"), // mars
		new Planet(scene, 0.1, 0.8, "resources/textures/moon_texture.jpg").translate([20, 0, 0]), // moon
	]
	
	const topLight = new THREE.DirectionalLight(0xffffff, 5); // (color, intensity)
	topLight.position.set(100, 100, 100) //top-left-ish
	topLight.castShadow = true;
	scene.add(topLight);

	const ambientLight = new THREE.AmbientLight(0x333333, 5);
	scene.add(ambientLight);

	var arrowHelper = new THREE.ArrowHelper(satellite.vel.clone().normalize(), satellite.pos.clone(), satellite.vel.clone().length()/10, 0xff0000 );
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
		else if (deltaTime > 0.1){
		deltaTime = 1/60;
		}
		then = now;

		if (simRunning) {		
			updateObjects(satellite, planets, deltaTime)
			trail.add(satellite.pos.clone())
		} 
    	setArrowToVel(satellite, arrowHelper)

    
		renderer.render(scene, camera);

	};
	
	animate();
}

await main()
