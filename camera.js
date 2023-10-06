function dot(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

function addTo(v1, v2, scalar=1) {
    v1[0] += scalar*v2[0];
    v1[1] += scalar*v2[1];
    v1[2] += scalar*v2[2];
}

function sum(v1, v2) {
    v = [0, 0, 0]
    v[0] = v1[0] + v2[0];
    v[1] = v1[1] + v2[1];
    v[2] = v1[2] + v2[2];
    return v;
}

function len(v) {
    return Math.sqrt(dot(v, v));
}

function normalize(v) {
    let l = len(v);
    return [v[0]/l, v[1]/l, v[2]/l];
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
};

function mulScalar(v, s) {
    return [v[0]*s, v[1]*s, v[2]*s];
}

function cross(v1, v2) {
    return  [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]] ;
}

function deg2rad(degrees)
{
  return degrees * (Math.PI/180);
}

class Camera {
    constructor() {
        // position and direction
        this.pos = new Float32Array(3);
        this.front = new Float32Array(3);
        this.up = new Float32Array(3);
        this.yaw = 90;
        this.pitch = 0;

        // matrices
        this.view = new Float32Array(16);
        this.proj = new Float32Array(16);

        // movement
        this.mvForward = false;
        this.mvBackward = false;
        this.mvUp = false;
        this.mvDown = false;
        this.mvLeft = false;
        this.mvRight = false;
        this.turnUp = false;
        this.turnDown = false;
        this.turnLeft = false;
        this.turnRight = false;
    }

    get viewMatrix() {
        return this.view;
    }

    get projMatrix() {
        return this.proj;
    }

    lookAt(from, to, up) {
        this.pos = from;
        this.front = normalize(sum(to, mulScalar(from, -1)));
        this.up = up;
        mat4.lookAt(this.view, from, to, up);
    }

    setPerspective(fovDeg, aspectRatio, near, far) {
        mat4.perspective(this.proj, fovDeg, aspectRatio, near, far);
    }

    updateView() {    
        mat4.lookAt(this.view, this.pos, sum(this.pos, this.front), this.up);
    }

    move(deltaTime) {
        const cameraSpeed = 6 * deltaTime; // adjust accordingly
        if (this.mvForward) addTo(this.pos, this.front, cameraSpeed);
        if (this.mvBackward) addTo(this.pos, this.front, -cameraSpeed);
        if (this.mvLeft) addTo(this.pos, normalize(cross(this.front, this.up)), -cameraSpeed);
        if (this.mvRight) addTo(this.pos, normalize(cross(this.front, this.up)), cameraSpeed);
        if (this.mvUp) addTo(this.pos, this.up, cameraSpeed);
        if (this.mvDown) addTo(this.pos, this.up, -cameraSpeed);

        const rotationSpeed = 20*deltaTime;
        if (this.turnRight) this.yaw += rotationSpeed;
        if (this.turnLeft) this.yaw -= rotationSpeed;
        if (this.turnUp) this.pitch += rotationSpeed;
        if (this.turnDown) this.pitch -= rotationSpeed;

        this.pitch = clamp(this.pitch, -89.0, 89.0);

        let direction = [0, 0, 0];
        direction[0] = Math.cos(deg2rad(this.yaw)) * Math.cos(deg2rad(this.pitch));
        direction[1] = Math.sin(deg2rad(this.pitch));
        direction[2] = Math.sin(deg2rad(this.yaw)) * Math.cos(deg2rad(this.pitch));
        this.front = normalize(direction);

    }

    // move() {
    //     var rotate = new Float32Array(3);


	// 	if (this.turnRight) rotate[1] += 0.016;
	// 	if (this.turnLeft) rotate[1] -= 0.016;

	// 	if (this.turnUp) rotate[0] += 0.016;
	// 	if (this.turnDown) rotate[0] -= 0.016;

	// 	if (dot(rotate, rotate) > 0.0001)
	// 	{
    //         rotate = normalize(rotate);
    //         for (var i = 0; i < 3; i++) {
    //             this.rotation[i] += 0.0015 * rotate[i];
    //         }
	// 	}

	// 	// limit pitch values between about +/- 85ish degrees
	// 	this.rotation[0] = clamp(this.rotation[0], -1.5, 1.5);
	// 	this.rotation[1] = this.rotation[1] - 2*Math.PI * Math.floor(this.rotation[1]/(2*Math.PI));

	// 	const yaw = this.rotation[1];
	// 	const forwardDir = [ Math.sin(yaw), 0, Math.cos(yaw) ];
	// 	const rightDir = [ forwardDir[2], 0, -forwardDir[2] ];
	// 	const upDir = [ 0, -1, 0 ];

	// 	var moveDir = [0, 0, 0];

	// 	if (this.forward) addTo(moveDir, forwardDir, 1);
	// 	if (this.backward) addTo(moveDir, forwardDir, -1);;

	// 	if (this.right) addTo(moveDir, rightDir, 1);
	// 	if (this.left) addTo(moveDir, rightDir, -1);

	// 	if (this.up) addTo(moveDir, upDir, 1);
	// 	if (this.down) addTo(moveDir, upDir, -1);

	// 	if (dot(moveDir, moveDir) > 0.00001)
	// 	{
    //         moveDir = normalize(moveDir);
    //         for (var i = 0; i < 3; i++) {
    //             this.pos[i] += 0.1*moveDir[i];
    //         }
	// 	}
    // }
}