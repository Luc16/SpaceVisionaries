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
import gsap from 'https://cdn.skypack.dev/gsap';

var changedPreset = false;

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
	document.querySelector('#gameCanvas').appendChild(renderer.domElement);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);
	const gui_container = document.getElementById("gui_container");

	const gui = new GUI({ autoPlace: false });
	gui.domElement.id = "gui";
	gui_container.appendChild(gui.domElement);
	
	return [renderer, gui]

}

function applyInitialParams(camera, controler, sun, earth) {
	camera.position.x = 24.375955763295476;
	camera.position.y = 6.096897081203575;
	camera.position.z = 19.341372778210438;

	controler.minDistance = sun.radius*5;
	controler.enablePan = false;
	controler.listenToKeyEvents(window);
	controler.enableDamping = true;
	controler.dampingFactor = 0.1
	controler.maxDistance = 2000;
	controler.target = earth.pos
	controler.update();

	
	

}

const updateObjects = function(satellite, planets, gravity, timer, dt) {
	for (const planet of planets) {
		satellite.acc.add(
			planet.pos.clone()
			.sub(satellite.pos)
			.normalize()
			.multiplyScalar(gravity*planet.mass/(satellite.pos.distanceToSquared(planet.pos)))
		)
	}
	
	satellite.vel.add(satellite.acc.clone().multiplyScalar(dt))

	satellite.pos.add(satellite.vel.clone().multiplyScalar(dt))

	for (const planet of planets) {
		if (satellite.pos.distanceToSquared(planet.pos) <= planet.radius*planet.radius) {
			timer.vel = 0;
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
	arrow.setLength(satellite.vel.clone().length())
}

const main = async function () {
	const generalControls = {
		gravityConstant: 1,
		preset: [10.246809049864057, 1.1937240000000011, 4.896345408993087, 0, -0.1, 0, -1],
	}
	const modeController = {
		overviewMode: true,
		travelModeRunning: false,
		changeCamera: false,
		prevMode: true,
		activateGalatic: function(){ this.overviewMode = true },
		activateTerrestrial: function(){ this.overviewMode = false }
	}
	const timer = { 
		time: 0, 
		vel: 1, 
		lastVel: 1,
		simInitTime: 0
	};

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 3000);

	const [renderer, gui] = createGuiAndRenderer()

	const composer = createComposer(scene, camera, renderer)
	const solarSystem = new SolarSystem(document, scene)
	const controls = new OrbitControls(camera, renderer.domElement);
	const labelRenderer = createLabelRenderer()

	const mouse = new THREE.Vector2();
	var closest = solarSystem.planets[2];
	var range = 2
	var targetName = "";

	applyInitialParams(camera, controls, solarSystem.sun, solarSystem.planets[2])

	const satellite = new Satellite(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.1, 0), 0.06, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.1, 0));
	satellite.vel = satellite.resetVel.clone()
	await satellite.loadModel(scene, "resources/satellite/scene.gltf")
	const trail = new Trail(scene, 100, 0xffffff)
	var arrowHelper = new THREE.ArrowHelper(satellite.vel.clone().normalize(), satellite.pos.clone(), satellite.vel.clone().length()/10, 0xff0000 );
	scene.add( arrowHelper );

	modeController.activateGalatic = function(){ 
		targetName = "";
		gsap.to(camera.position, {
			x: 24.375955763295476,
			y: 6.096897081203575,
			z: 19.341372778210438,
			duration: 1.5,
			onUpdate: function () {
				camera.lookAt(solarSystem.sun);
				onWheel();
			}
		})
		controls.target = solarSystem.sun.pos
		controls.update();
		timer.vel = 1
		this.overviewMode = true 
	}

	const resetSatellite = function () {
		controls.target = solarSystem.planets[2].pos
		controls.maxDistance = solarSystem.planets[2].radius*10;
		controls.minDistance = solarSystem.planets[2].radius*10;
		controls.update();
		modeController.changeCamera = false;
		modeController.travelModeRunning = false
		trail.reset()

		if (typeof generalControls.preset === 'string') {
			generalControls.preset = generalControls.preset.replace("[", "").replace("]", "").split(",").map(Number)
		}
		var timeSet = false
		if (generalControls.preset[6] > 0) {
			timeSet = true
			timer.time = generalControls.preset[6]
		} else {
			timer.time = timer.simInitTime
		}

		if (changedPreset) {
			satellite.resetVel.x = generalControls.preset[3]
			satellite.resetVel.y = generalControls.preset[4]
			satellite.resetVel.z = generalControls.preset[5]
			if (timeSet) {
				satellite.resetPos.x = generalControls.preset[0]
				satellite.resetPos.y = generalControls.preset[1]
				satellite.resetPos.z = generalControls.preset[2]
			}
		}
		satellite.vel = satellite.resetVel.clone()
		satellite.pos = satellite.resetPos.clone()


		satellite.acc = new THREE.Vector3(0, 0, 0)
		changedPreset = false
	}

	const buttons = {
		resetSat: function() {
			resetSatellite()
		},
		run: function(){ 
			if (!modeController.travelModeRunning) {
				satellite.resetVel = satellite.vel.clone()
				modeController.travelModeRunning = true 
				timer.vel = 1
				// console.log(`[${satellite.pos.x}, ${satellite.pos.y}, ${satellite.pos.z}, ${satellite.vel.x}, ${satellite.vel.y}, ${satellite.vel.z}, ${timer.time}]`);
			}
			
		},
		satCam: function () { modeController.changeCamera = true },
		earthCam: function () { modeController.changeCamera = false }
	}
	
	// create guis
	const missions = gui.addFolder("Missions");
	missions.open()
	missions.add(modeController, "activateGalatic").name("Overview Mode")
	missions.add(modeController, "activateTerrestrial").name("Galatic Travel")

	const timeSettings = gui.addFolder("Time Settings");
	timeSettings.open()
	timeSettings.add(timer, "time", 0, 1000, 0.01).name("time").listen()
	timeSettings.add(timer, "vel", 0, 5, 0.01).name("velocity").listen()

	const satSettings = gui.addFolder("Controls");
	satSettings.hide()
	satSettings.add(buttons, "run").name("Launch")
	satSettings.add(buttons, "resetSat").name("Reset")
	satSettings.add(buttons, "satCam").name("Switch to Satellite View")
	satSettings.add(buttons, "earthCam").name("Switch to Earth View")

	const presetSelector = satSettings.add(generalControls, "preset", {
		"Default": [3.2328387056557553, 1.1937240000000022, 9.85211694139966, 0, 5.878500000000001, 0, 6.2116785000000005],
		"Pass By Jupiter": [-2.021128339438988, 1.193724000000002, 9.347612864810039, 27.2562, 9.9802, 9.472100000000001, 8.559918199999997], 
		"GA on Saturn": [11.526917894518315, 1.193724, -0.14323023733115978, 50, 7.4019, 4.0174, 83.27830549999999],
		"Crash with Mars": [-4.752302894710143, 1.1937240000000018, 7.7807668487346024, -26.079700000000003, -1.8921000000000001, -23.604100000000003, 482.17783999999915],
		"Crash with Mercury": [-7.397484455156295, 1.193723999999999, -4.50894958182004, 48.861900000000006, -12.905000000000001, 50, 571.5294155000013], 
		"GA on Uranus": [-2.057544383162217, 1.193724000000002, 9.333709430501823, -25.703400000000002, 8.5645, 75, 703.0350093900004],
		"Double GA": [11.329370589492553, 1.1937240000000005, 1.9826389707195744, 75, -1.5889, -0.31970000000000004, 1000.9074545000001], 
		"Crash with Saturn": [6.574269213901129, 1.193724000000002, 8.632047447275971, 75, 11.1029, 35.217400000000005, 1004.6308958400011], 
		"GA on Ceres": [10.96407028527316, 1.1937240000000007, 3.310020108511075, 12.4213, 22.6017, 5.6344, 1.5167150000000218],

	})
	.onFinishChange(
		function(){
			changedPreset = true
			buttons.resetSat()
		}
	  ).name("Presets")


	const velControl = satSettings.addFolder("Try it yourself");
	velControl.add(satellite.vel, "x", -75, 75, 0.0001).name("Velocity X").listen()
	velControl.add(satellite.vel, "y", -75, 75, 0.0001).name("Velocity Y").listen()
	velControl.add(satellite.vel, "z", -75, 75, 0.0001).name("Velocity Z").listen()	

	// set callbacks
	window.addEventListener('resize', onWindowResize);
	document.onmousemove = onMouseMove;
	document.onclick = onClick;
	document.onwheel = onWheel
	window.onblur = function(ev){ modeController.travelModeRunning = false; }
	window.onfocus = function(ev){ modeController.travelModeRunning = true; }
	document.addEventListener('keydown', (event) => {
		if (event.key == 'r') {
		  location.reload()
		}
	
	}, false);

	const raycaster = new THREE.Raycaster();

	scene.add(new THREE.AmbientLight(0xffffff, 5));
	const light = new THREE.PointLight( 0xffffff, 10, 0, 0 );
	light.position.set( 0, 0, 0 );
	scene.add( light );

	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);

		now *= 0.0005;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0;
			timer.time = 0;
		}
		then = now;
		timer.time += timer.vel * deltaTime;

		// switch mode
		if (modeController.prevMode != modeController.overviewMode){
			trail.reset()

			modeController.prevMode = modeController.overviewMode;
			if (!modeController.overviewMode) {
				closest = solarSystem.planets[2] // earth
				satellite.resetPos = closest.pos.clone().add(new THREE.Vector3(closest.radius*2, closest.radius*2, 0))
				if (generalControls.preset[6] > 0) {
					timer.time = generalControls.preset[6]

					satellite.resetPos.x = generalControls.preset[0]
					satellite.resetPos.y = generalControls.preset[1]
					satellite.resetPos.z = generalControls.preset[2]

					satellite.pos = satellite.resetPos.clone()
				}
				satellite.pos = satellite.resetPos.clone() 


				satellite.vel = satellite.resetVel
				
				targetName = solarSystem.sun.name
				zoomIn(12)
				
				setArrowToVel(satellite, arrowHelper)
				satellite.scl = 0.06
				modeController.travelModeRunning = false

				timeSettings.hide()
				satSettings.show()
				satSettings.open()

				timer.simInitTime = timer.time


				document.onmousemove = function(){};
				document.onclick = function(){};
				document.onwheel = function(){}

			} else {
				gsap.to(camera.position, {
					x: 24.375955763295476,
					y: 6.096897081203575,
					z: 19.341372778210438,
					duration: 1.5,
					onUpdate: function () {
						camera.lookAt(solarSystem.sun);
						onWheel();
					}
				})
				controls.update();

				timeSettings.show()
				satSettings.hide()
				closest = solarSystem.sun // earth
				document.onmousemove = onMouseMove;
				document.onclick = onClick;
				document.onwheel = onWheel

			}
		}

		if (!modeController.overviewMode) {
			setArrowToVel(satellite, arrowHelper)

			if (modeController.travelModeRunning) {	

				updateObjects(satellite, solarSystem.planets, generalControls.gravityConstant, timer, deltaTime)    
				trail.add(satellite.pos.clone())

				if(controls.target == satellite.pos){
					controls.maxDistance = 3;
					controls.minDistance = 3;
				}
				if(controls.target == closest.pos){
				controls.maxDistance = 10000;
				controls.minDistance = 1;
				}
			}
			else{
				timer.lastVel = timer.vel;
				timer.vel = 0;
				controls.maxDistance = 10000;
				controls.minDistance = 0.2;
			}
		
			if(modeController.changeCamera){
				controls.target = satellite.pos;
			}
			else{
				controls.target = solarSystem.planets[2].pos;
			}

		} else {
			satellite.resetPos = solarSystem.planets[2].pos.clone().add(new THREE.Vector3(solarSystem.planets[2].radius*2, solarSystem.planets[2].radius*2, 0))
      
			satellite.pos = satellite.resetPos.clone() 
      setArrowToVel(satellite, arrowHelper)
		}
		if (timer.time) {
			solarSystem.move(timer.time);
		}
		controls.update()

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

	function zoomIn(zoom) {
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
	
				gsap.to(camera.position, {
					x: auxVector.x,
					y: auxVector.y,
					z: auxVector.z,
					duration: 1.5,
					onUpdate: function () {
						camera.lookAt(closest.pos);
						onWheel();
					}
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
		zoomIn(3)
	}

	function onWheel() {
		let vec1 = camera.position.clone();
		let vec2 = controls.target.clone();
		let norm = vec1.sub(vec2).length();
		range = norm*0.1;
	}

}

await main()
