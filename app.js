var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'varying vec2 fragTexCoord;',
'uniform mat4 mModel;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragTexCoord = vertTexCoord;',
'  gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec2 fragTexCoord;',
'uniform sampler2D uTexture;',
'void main()',
'{',
'  gl_FragColor = texture2D(uTexture, fragTexCoord);',
'}'
].join('\n');


const LEFT = 'j'
const UP = 'i'
const RIGHT = 'l'
const DOWN = 'k'

const camera = new Camera();

function onKeyDown(event) {
	if (event.key == 'w') {
        camera.mvForward = true;
    } else if (event.key == 's') {
        camera.mvBackward = true;
    } 
	if (event.key == 'a') {
        camera.mvLeft = true;
	} else if (event.key == 'd') {
        camera.mvRight = true;
	}
	if (event.key == 'q') {
        camera.mvUp = true;
	} else if (event.key == 'e') {
        camera.mvDown = true;
	}
	if (event.key == LEFT) {
        camera.turnLeft = true;
	} else if (event.key == RIGHT) {
        camera.turnRight = true;
	}
	if (event.key == UP) {
        camera.turnUp = true;
	} else if (event.key == DOWN) {
        camera.turnDown = true;
	}
}

function onKeyUp(event) {
    if (event.key == 'w') {
        camera.mvForward = false;
    } else if (event.key == 's') {
        camera.mvBackward = false;
    } 
	if (event.key == 'a') {
        camera.mvLeft = false;
	} else if (event.key == 'd') {
        camera.mvRight = false;
	}
	if (event.key == 'q') {
        camera.mvUp = false;
	} else if (event.key == 'e') {
        camera.mvDown = false;
	}
	if (event.key == LEFT) {
        camera.turnLeft = false;
	} else if (event.key == RIGHT) {
        camera.turnRight = false;
	}
	if (event.key == UP) {
        camera.turnUp = false;
	} else if (event.key == DOWN) {
        camera.turnDown = false;
	}
}

function createContext(canvas) {
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.1, 0.1, 0.1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	return gl;
}

function createShaders(gl){
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		throw new Error();
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		throw new Error();
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		throw new Error();
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		throw new Error();
	}

	return program;
}


var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	var gl = createContext(canvas);

	//
	// Create shaders
	// 
	let program = createShaders(gl);

	//
	// Create buffer
	//
	var sphere = createSphere(50);
	var earth = new Planet(gl, program, sphere, 1, "http://localhost:8000/earth_texture.jpg");

	var moon = new Planet(gl, program, sphere, 0.5, "http://localhost:8000/moon_texture.jpg");
	moon.translate([3, 0, 0]);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mModel');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	camera.setPerspective(glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
	camera.lookAt([0, 0, -8], [0, 0, 0], [0, 1, 0]);

	var worldMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, camera.viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, camera.projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;

	let then = 0;
	var loop = function (now) {
		now *= 0.001;
		const deltaTime = now - then;
		then = now;

		camera.move(deltaTime);
		camera.updateView();
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, camera.viewMatrix);

		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		angle = deltaTime / 6 * 2 * Math.PI;
		earth.rotation[1] += angle;
		earth.rotation[0] += angle/4;
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, earth.getModelMatrix());
		earth.render(gl);

		moon.rotation[2] += 3*angle;
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, moon.getModelMatrix());
		moon.render(gl)

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};
