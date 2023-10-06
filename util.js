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