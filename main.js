import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

import { SolarSystem } from './solar_system.js';
import { Planet } from './planet.js';
import { Satellite } from './satellite_class.js';
import { Vector3 } from "three";
import { BasicOrbit } from './basic_orbit.js';

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
	
	var resetPos = new THREE.Vector3(-8, 0, 0)
	var resetVel = new THREE.Vector3(2.5, -9.8, 0)

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

	const trail = new Trail(scene, 100, 0xffffff)
  var changeCamera = false;
	document.addEventListener('keydown', (event) => {
		if (event.code == 'Space') {
			if (!simRunning){
				resetVel = satellite.vel.clone()
			}
			simRunning = !simRunning
		} 
		else if (event.key == 'r') {
		  location.reload()
    }
    else if(event.key == 't'){
      changeCamera = !changeCamera;
    }
	
	}, false);

	const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
	renderer.setSize(window.innerWidth, window.innerHeight);
  
	document.getElementById("container3D").appendChild(renderer.domElement);
	camera.position.z = 10;
	
	const planets = [
		new Planet(document, scene, new BasicOrbit(scene, 0, 0, 0, 0, 0x000000), "P", 0.7, 2, "resources/textures/mars_texture.jpg", 0), 
		new Planet(document, scene, new BasicOrbit(scene, 10, 9.9985, 0.33422, 0, 0x00ced1),"L", 4.5, 1, "resources/textures/moon_texture.jpg", 0.1).translate([10, 0, 0]), // moon
	]
	
	const topLight = new THREE.DirectionalLight(0xffffff, 3); // (color, intensity)
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

  // var mouse = new THREE.Vector2();
  // var intersectionPoint = new THREE.Vector3();
  // var planeNormal =new THREE.Vector3();
  // var plane = new THREE.Plane();
  // var raycaster = new THREE.Raycaster();
  // document.addEventListener('click', (event) => {
  //   if(simRunning === false){
  //     console.log(satellite.pos)
  //     mouse.x = (event.clientX/window.innerWidth)*2 - 1;
  //     mouse.y = -(event.clientY/window.innerHeight)*2 + 1;
  //     planeNormal.copy(camera.position).normalize();
  //     plane.setFromNormalAndCoplanarPoint(planeNormal, planets[0].pos);
  //     raycaster.setFromCamera(mouse, camera);
  //     raycaster.ray.intersectPlane(plane, intersectionPoint);
  //     satellite.pos = intersectionPoint;
  //   }
  // }, false);

  // controls.saveState();
  controls.target = satellite.pos
  controls.maxDistance = 7;
  controls.minDistance = 7;  
	
  var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);
		now *= 0.0001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
		}
		else if (deltaTime > 0.1){
		  deltaTime = 1/60;
		}
		then = now;
   
    setArrowToVel(satellite, arrowHelper)
		renderer.render(scene, camera);

    // planets[1].move(deltaTime)

    if (simRunning) {	

      updateObjects(satellite, planets, deltaTime)    
      trail.add(satellite.pos.clone())

      if(controls.target == satellite.pos){
       controls.maxDistance = 5;
        controls.maxDistance = 5;
      }
    }
    else{
      controls.maxDistance = 1000;
      controls.minDistance = 2;
    }
  
    if(changeCamera){
      controls.target = satellite.pos;
    }
    else{
      controls.target = planets[0].pos; 
    }

    controls.update();
    
  };

	animate();
}

await main()
