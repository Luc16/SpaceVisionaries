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
}