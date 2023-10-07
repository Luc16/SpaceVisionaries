import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer';
import { SSAARenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/SSAARenderPass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js';
import { ColorCorrectionShader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/shaders/ColorCorrectionShader.js';

import { SolarSystem } from './solar_system.js';


const main = function () {

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	document.body.appendChild(renderer.domElement);

	const renderPass = new RenderPass(scene, camera);
	renderPass.clearAlpha = 0;


	const ssaaRenderPass = new SSAARenderPass( scene, camera );	
	const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
	const composer = new EffectComposer(renderer);

	ssaaRenderPass.sampleLevel = 4;

	composer.addPass(renderPass);
	composer.addPass(colorCorrectionPass);
	composer.addPass(ssaaRenderPass);


	const solarSystem = new SolarSystem(scene)
	solarSystem.drawOrbits(scene);

	const controls = new OrbitControls(camera, renderer.domElement);

	camera.position.z = 5;
	controls.update();

	controls.keys = {
		LEFT: 'ArrowLeft', //left arrow
		UP: 'ArrowUp', // up arrow
		RIGHT: 'ArrowRight', // right arrow
		BOTTOM: 'ArrowDown' // down arrow
	}

	controls.listenToKeyEvents(window);

	var then = 0;
	function animate(now) {
		requestAnimationFrame(animate);

		now *= 0.001;
		var deltaTime = now - then;
		if (!deltaTime) {
			deltaTime = 0
		}
		then = now;

		solarSystem.move();

		controls.update()

		composer.render()
		// renderer.render(scene, camera);

	};

	animate();
}

main()