import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer';
import { SSAARenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/SSAARenderPass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass';
import { ColorCorrectionShader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/shaders/ColorCorrectionShader.js';
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";
import { GUI } from "dat.gui"
import { SolarSystem } from './solar_system.js';
import { Vector3 } from "three";
import gsap from 'https://cdn.skypack.dev/gsap';


const main = function () {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 2000);

	const BLOOM_SCENE = 1;

	const bloomLayer = new THREE.Layers();
	bloomLayer.set( BLOOM_SCENE );

	const params = {
		threshold: 0.1,
		strength: 0.3,
		radius: 0.1,
		exposure: 0.01
	};

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
	const gui_container = document.getElementById("gui_container");

	const gui = new GUI({ autoPlace: false });
	gui.domElement.id = "gui";
	gui_container.appendChild(gui.domElement);
	const timeSettings = gui.addFolder("Time Settings");
	const missions = gui.addFolder("Missions");

	const renderPass = new RenderPass(scene, camera);
	renderPass.clearAlpha = 0;

	const ssaaRenderPass = new SSAARenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	bloomPass.threshold = params.threshold;
	bloomPass.strength = params.strength;
	bloomPass.radius = params.radius;
	bloomPass.exposure = params.exposure;
	const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
	const composer = new EffectComposer(renderer);

	ssaaRenderPass.sampleLevel = 0;

	composer.addPass(renderPass);
	composer.addPass(colorCorrectionPass);
	composer.addPass(ssaaRenderPass);
	composer.addPass(bloomPass);

	const cubeTextureLoader = new THREE.CubeTextureLoader();
	scene.background = cubeTextureLoader.load([
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg",
		"resources/textures/stars_skybox.jpg"
	]);

	const solarSystem = new SolarSystem(document, scene)

	const controls = new OrbitControls(camera, renderer.domElement);

	camera.position.x = 24.375955763295476;
	camera.position.y = 6.096897081203575;
	camera.position.z = 19.341372778210438;
	camera.lookAt([0, 0, 0]);

	controls.minDistance = solarSystem.sun.radius*5;
	controls.enablePan = false;
	controls.maxDistance = 1000;
	controls.update();

	const labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	labelRenderer.domElement.style.fontSize = 10000;
	labelRenderer.domElement.style.color = 'LightGrey'
	document.body.appendChild(labelRenderer.domElement);

	controls.listenToKeyEvents(window);
	controls.enableDamping = true;
	controls.dampingFactor = 0.1
	

	window.addEventListener('resize', onWindowResize);

	const mouse = new THREE.Vector2();
	var closest = solarSystem.sun;
	let range = 2;

	// closest = null
	document.onmousemove = function (e) {
		mouse.x = (e.offsetX / window.innerWidth) * 2 - 1;
		mouse.y = - (e.offsetY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		const ray = raycaster.ray

		var closestDist = 1000000;
		closest = null;
		for (const planet of solarSystem.getPlanets()) {
			const dist = ray.distanceSqToPoint(planet.getPosition())
			if (dist < closestDist && dist < range) {
				closest = planet
				closestDist = dist
			} else {
				planet.orbit.orbitLine.material.color.set(new THREE.Color(planet.orbit.originalColor));
				planet.orbit.orbitLine.material.needsUpdate = true;
				labelRenderer.domElement.style.color = 'LightGrey'
			}
		}

		const dist = ray.distanceSqToPoint(solarSystem.sun.getPosition())
		if (dist < closestDist && dist < range) {
			closest = solarSystem.sun
			closestDist = dist
		} else {
			labelRenderer.domElement.style.color = 'LightGrey'
		}

		closest.orbit.orbitLine.material.color.set(new THREE.Color(0xffffff));
		closest.orbit.orbitLine.material.needsUpdate = true;
		labelRenderer.domElement.style.color = 'white'


	}

	const raycaster = new THREE.Raycaster();
	const timer = { time: 0, vel: 1, lastVel: 1 };
	let targetName = "";

	document.onclick = function () {
		if (closest != null) {
			if (closest.name != 'Sun') {
				timer.lastVel = timer.vel;
				timer.vel = 0
			} else {
				if ( timer.lastVel != 0 ) {
					timer.vel = timer.lastVel;
				} else {
					timer.vel = 1
				}
				
			}
			if (targetName != closest.name) {
				controls.target = closest.getPosition();
				controls.minDistance = closest.radius*5;
				controls.update();
	
				//console.log(camera.position)
				const auxVector = new Vector3(camera.position.x, camera.position.y, camera.position.z)
				
				//console.log(auxVector)
				//console.log(closest.getPosition())
				auxVector.sub(closest.getPosition());
				//console.log(auxVector)
				auxVector.normalize();
				//console.log(auxVector)
				//console.log(closest.radius)
				auxVector.multiplyScalar(closest.radius*3);
				//console.log(auxVector)
				const aux = new Vector3(closest.getPosition().x, closest.getPosition().y, closest.getPosition().z); 
				auxVector.copy(aux.add(auxVector));
				//console.log(auxVector)
	
				gsap.to(camera.position, {
					x: auxVector.x,
					y: auxVector.y,
					z: auxVector.z,
					duration: 1.5,
					onUpdate: function () {
						camera.lookAt(closest.getPosition());
						rangeCalculator();
					}
				})
	
				controls.update();
				targetName = closest.name;
			}

		} else {
			// if (timer.vel == 0) {
			// 	timer.vel = timer.lastVel;
			// }
			// if ( timer.lastVel == 0 ) {
			// 	timer.vel = 1
			// }
			timer.vel = timer.vel;
			controls.minDistance = 0;
		}

	}

	document.onwheel = rangeCalculator;

	function rangeCalculator() {
		let vec1 = camera.position.clone();
		let vec2 = controls.target.clone();
		let norm = vec1.sub(vec2).length();
		console.log(norm);
		range = norm*0.1;
		console.log(`Range: ${range}`);
	}

	timeSettings.add(timer, "time", 0, 1000, 0.01).name("time").listen()
	timeSettings.add(timer, "vel", 0, 5, 0.01).name("velocity").listen()



	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);

		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0;
			timer.time = 0;
		}
		then = now;
		timer.time += timer.vel * deltaTime;

		if (timer.time) {
			solarSystem.move(timer.time);
		}

		controls.update();

		labelRenderer.render(scene, camera);

		composer.render();
		// renderer.render(scene, camera);

	};

	animate();

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight)

	}
}

main()