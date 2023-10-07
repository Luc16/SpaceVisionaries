export class VectorImpl{
    constructor(x, y, z){
        this.v = [x, y, z]
    }
    
    set x(newx){
        this.v[0] = newx;
    }

    set y(newy){
        this.v[1] = newy;
    }

    set z(newz){
        this.v[2] = newz;
    }

    get x(){
        return this.v[0]
    }

    get y(){
        return this.v[1]
    }

    get z(){
        return this.v[2]
    }

    static dot(v1, v2) {
        return v1.getX()*v2.getX() + v1.getY()*v2.getY() + v1.getZ()*v2.getZ();
    }

    static add(v1, v2, scalar1=1, scalar2=1) {
        return [
            scalar1*v1.getX() + scalar2*v2.getX(),
            scalar1*v1.getY() + scalar2*v2.getY(),
            scalar1*v1.getZ() + scalar2*v2.getZ()
        ]
    }

    mulScalar(scalar) {
        this.v = [this.v[0]*scalar, this.v[1]*scalar, this.v[2]*scalar];
    }

    normalize(scalar) {
        this.v = [this.v[0]/scalar, this.v[1]/scalar, this.v[2]/scalar];
    }
}