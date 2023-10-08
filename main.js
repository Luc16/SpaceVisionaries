import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer';
import { SSAARenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/SSAARenderPass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js';
import { ColorCorrectionShader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/shaders/ColorCorrectionShader.js';
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";
import { GUI } from "dat.gui" 
import { SolarSystem } from './solar_system.js';


const main = function () {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);

	const gui = new GUI()

	const renderPass = new RenderPass(scene, camera);
	renderPass.clearAlpha = 0;

	const ssaaRenderPass = new SSAARenderPass(scene, camera);
	const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
	const composer = new EffectComposer(renderer);

	ssaaRenderPass.sampleLevel = 0;

	composer.addPass(renderPass);
	composer.addPass(colorCorrectionPass);
	composer.addPass(ssaaRenderPass);

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

	camera.position.z = 5;
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
	var closest = null;

	document.onmousemove = function(e){
		mouse.x = ( e.offsetX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.offsetY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		const ray = raycaster.ray

		closest = null
		var closestDist = 1000000;
		for (const planet of solarSystem.getPlanets()) {
			const dist = ray.distanceSqToPoint(planet.getPosition())
			if (dist < closestDist && dist < 2 ){
				closest = planet
				closestDist = dist
			} else {
				planet.orbit.orbitLine.material.color.set(new THREE.Color( planet.orbit.originalColor ));         
				planet.orbit.orbitLine.material.needsUpdate = true;
				labelRenderer.domElement.style.color = 'LightGrey'
			}
		}

		const dist = ray.distanceSqToPoint(solarSystem.sun.getPosition())
		if (dist < closestDist && dist < 2 || closest == null ){
			closest = solarSystem.sun
			closestDist = dist
		} else {
			labelRenderer.domElement.style.color = 'LightGrey'
		}

		closest.orbit.orbitLine.material.color.set(new THREE.Color( 0xffffff ));         
		closest.orbit.orbitLine.material.needsUpdate = true;
		labelRenderer.domElement.style.color = 'white'
		

	}

	const raycaster = new THREE.Raycaster();
	const timer = {time: 0, vel: 1}


	document.onclick = function() {
		if (closest != null) {
			if (closest.name != 'Sun') {
				timer.vel = 0
			} else {
				timer.vel = 1
			}
			controls.target = closest.getPosition()
		} else {
			timer.vel = 1
		}

	}



	gui.add(timer, "time", 0, 1000, 0.01).name("time").listen()
	gui.add(timer, "vel", 0, 5, 0.01).name("velocity").listen()

	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);

		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
			timer.time = 0
		}
		then = now;
		timer.time += timer.vel*deltaTime

		if (timer.time) {
			solarSystem.move(timer.time);
		}

		controls.update()

		labelRenderer.render(scene, camera)

		composer.render()
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