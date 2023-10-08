import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer';
import { SSAARenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/SSAARenderPass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass';
import { ColorCorrectionShader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/shaders/ColorCorrectionShader.js';
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";
import { GUI } from "https://cdn.skypack.dev/dat.gui"
import { SolarSystem } from './solar_system.js';
import { Satellite } from './satellite_class.js';
import { Trail } from "./trail.js";
import { Vector3 } from "three";
import gsap from 'https://cdn.skypack.dev/gsap';
import { normalize } from "three/src/math/MathUtils.js";

function createLabelRenderer() {
	const labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	labelRenderer.domElement.style.fontSize = 10000;
	labelRenderer.domElement.style.color = 'LightGrey'
	document.body.appendChild(labelRenderer.domElement);
	return labelRenderer

}

function createComposer(scene, camera, renderer) {
	const params = {
		threshold: 0.1,
		strength: 0.3,
		radius: 0.1,
		exposure: 0.01
	};

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

	return composer
}

function createGuiAndRenderer() {
	const BLOOM_SCENE = 1;

	const bloomLayer = new THREE.Layers();
	bloomLayer.set( BLOOM_SCENE );

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
	const gui_container = document.getElementById("gui_container");

	const gui = new GUI({ autoPlace: false });
	gui.domElement.id = "gui";
	gui_container.appendChild(gui.domElement);
	
	return [renderer, gui]

}

function applyInitialParams(camera, controler, sun) {
	camera.position.x = 24.375955763295476;
	camera.position.y = 6.096897081203575;
	camera.position.z = 19.341372778210438;
	camera.lookAt([0, 0, 0]);

	controler.minDistance = sun.radius*5;
	controler.enablePan = false;
	controler.update();

	
	controler.listenToKeyEvents(window);
	controler.enableDamping = true;
	controler.dampingFactor = 0.1
	controler.maxDistance = 1000;

}

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

const main = async function () {
	const modeController = {
		galaticMode: true,
		terModeRunning: false,
		changeCamera: false,
		prevMode: true,
		activateGalatic: function(){ this.galaticMode = true },
		activateTerrestrial: function(){ this.galaticMode = false }
	}
	const timer = { 
		time: 0, 
		vel: 1, 
		lastVel: 1 
	};


	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 2000);

	const [renderer, gui] = createGuiAndRenderer()
	const missions = gui.addFolder("Missions");
	const g = missions.add(modeController, "activateGalatic").name("Galatic Travel")
	const k = missions.add(modeController, "activateTerrestrial").name("Terrestrial Travel")

	const timeSettings = gui.addFolder("Time Settings");
	timeSettings.add(timer, "time", 0, 1000, 0.01).name("time").listen()
	timeSettings.add(timer, "vel", 0, 5, 0.01).name("velocity").listen()

	

	const composer = createComposer(scene, camera, renderer)
	const solarSystem = new SolarSystem(document, scene)
	const controls = new OrbitControls(camera, renderer.domElement);
	const labelRenderer = createLabelRenderer()

	applyInitialParams(camera, controls, solarSystem.sun)

	const satellite = new Satellite([0, 0, 0], [0, 0, 0], 0.1);
	await satellite.loadModel(scene, "resources/satellite/scene.gltf")
	var resetPos = new THREE.Vector3(-8, 0, 0)
	var resetVel = new THREE.Vector3(2.5, -9.8, 0)
	resetSatellite(satellite, resetPos, resetVel);
	const trail = new Trail(scene, 100, 0xffffff)
	var arrowHelper = new THREE.ArrowHelper(satellite.vel.clone().normalize(), satellite.pos.clone(), satellite.vel.clone().length()/10, 0xff0000 );
	scene.add( arrowHelper );

	// set callbacks
	window.addEventListener('resize', onWindowResize);
	document.onmousemove = onMouseMove;
	document.onclick = onClick;
	document.onwheel = onWheel()
	window.onblur = function(ev){ modeController.terModeRunning = false; }
	window.onfocus = function(ev){ modeController.terModeRunning = true; }
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

	const mouse = new THREE.Vector2();
	var closest = solarSystem.sun;
	var range = 2
	var targetName = "";


	const raycaster = new THREE.Raycaster();

	const ambientLight = new THREE.AmbientLight(0xffffff, 5);
	scene.add(ambientLight);

	// scene.add( new THREE.AmbientLight( 0xcccccc ) );

	//const pointLight = new THREE.PointLight( 0xffffff, 100 );
	//camera.add( pointLight );


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

		if (modeController.prevMode != modeController.galaticMode){
			modeController.prevMode = modeController.galaticMode;
			if (!modeController.galaticMode) {
				closest = solarSystem.planets[2] // earth
				zoomIn(false, 12)
				satellite.pos = closest.pos.clone().add(new Vector3(0.08, 0.08, 0)) 
				setArrowToVel(satellite, arrowHelper)
				satellite.scl = 0.002

				document.onmousemove = function(){};
				document.onclick = function(){};
				document.onwheel = function(){}

			} else {
				closest = solarSystem.sun // earth
				zoomIn(false, 100)
				document.onmousemove = onMouseMove;
				document.onclick = onClick;
				document.onwheel = onWheel()
			}
		}
		
		if (timer.time) {
			solarSystem.move(timer.time);
		}

		labelRenderer.render(scene, camera);

		composer.render();

	};

	animate();

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight)

	}

	function onMouseMove(e){
		mouse.x = (e.offsetX / window.innerWidth) * 2 - 1;
		mouse.y = - (e.offsetY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		const ray = raycaster.ray

		var closestDist = 1000000;
		closest = null;
		for (const planet of solarSystem.getPlanets()) {
			const dist = ray.distanceSqToPoint(planet.pos)
			if (dist < closestDist && dist < range) {
				closest = planet
				closestDist = dist
			} else {
				planet.orbit.orbitLine.material.color.set(new THREE.Color(planet.orbit.originalColor));
				planet.orbit.orbitLine.material.needsUpdate = true;
				labelRenderer.domElement.style.color = 'LightGrey'
			}
		}

		const dist = ray.distanceSqToPoint(solarSystem.sun.pos)
		if (dist < closestDist && dist < range) {
			closest = solarSystem.sun
			closestDist = dist
		} else {
			labelRenderer.domElement.style.color = 'LightGrey'
		}

		if (closest != null) {
			closest.orbit.orbitLine.material.color.set(new THREE.Color(0xffffff));
			closest.orbit.orbitLine.material.needsUpdate = true;
			labelRenderer.domElement.style.color = 'white'
		}
		
	}

	function zoomIn(fromClick, zoom) {
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
			
				controls.target = closest.pos;
				controls.minDistance = closest.radius*5;
				controls.update();

				const auxVector = closest.pos.clone().add(camera.position.clone()
					.sub(closest.pos)
					.normalize()
					.multiplyScalar(closest.radius*zoom))

				var p = closest.pos
				while(closest.pos != p && fromClick) {
					p = closest.pos
				}
				
				gsap.to(camera.position, {
					x: auxVector.x,
					y: auxVector.y,
					z: auxVector.z,
					duration: 1.5,
					onUpdate: function () {
						camera.lookAt(closest.pos);
						let vec1 = camera.position.clone();
						let vec2 = controls.target.clone();
						let norm = vec1.sub(vec2).length();
						range = norm*0.1;					}
				})
				controls.update();
				targetName = closest.name;
			}
		} else {
			timer.vel = timer.vel;
			controls.minDistance = 0;
		}
	}

	function onClick() {
		zoomIn(true, 3)
	}

	function onWheel() {
		let vec1 = camera.position.clone();
		let vec2 = controls.target.clone();
		let norm = vec1.sub(vec2).length();
		range = norm*0.1;
	}
}

await main()