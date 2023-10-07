import { Planet } from './planet.js';
import { BasicOrbit } from './basic_orbit.js';


export class SolarSystem {
    constructor(scene) {
        const sunRadius =  0.93/2; //TODO: Radio multiplicado por 100

        const mercuryRadius = 0.0035*sunRadius*10;
        const venusRadius = 0.0087*sunRadius*10;
        const earthRadius = 0.0092*sunRadius*10;
        const marsRadius = 0.0049*sunRadius*10;
        const jupiterRadius = 0.1028*sunRadius*10;
        const saturnRadius = 0.0866*sunRadius*10;
        const uranusRadius = 0.0367*sunRadius*10;
        const neptuneRadius = 0.0356*sunRadius*10;

        this.sunMercuryDist = 0.39;
        this.sunVenusDist = 0.72;
        this.sunEarthDist = 1;
        this.sunMarsDist = 1.52;
        this.sunJupiterDist = 5.2;
        this.sunSaturnDist = 9.54;
        this.sunUranusDist = 19.2;
        this.sunNeptuneDist = 30.06;

        this.planets = [];
        this.orbits = [];

        this.currentPosition = 0;

        var sun = new Planet(scene, sunRadius, "resources/textures/sun_texture.jpg");
	
        var mercury = new Planet(sun.getMesh(), mercuryRadius, "resources/textures/mercury_texture.jpg", 0.0008);
        mercury.translate([this.sunMercuryDist, 0, 0])
        this.planets.push(mercury);

        var venus = new Planet(sun.getMesh(), venusRadius, "resources/textures/venus_texture.jpg", 0.00065);
        venus.translate([this.sunVenusDist, 0, 0])
        this.planets.push(venus);

        var earth = new Planet(sun.getMesh(), earthRadius, "resources/textures/earth_texture.jpg", 0.0006);
        earth.translate([this.sunEarthDist, 0,0])
        this.planets.push(earth);

        var mars = new Planet(scene, marsRadius, "resources/textures/mars_texture.jpg", 0.0005);
        mars.translate([this.sunMarsDist, 0, 0])
        this.planets.push(mars);

        var jupiter = new Planet(scene, jupiterRadius, "resources/textures/jupiter_texture.jpg", 0.00025);
        jupiter.translate([this.sunJupiterDist, 0, 0])
        this.planets.push(jupiter);

        var saturn = new Planet(scene, saturnRadius, "resources/textures/saturn_texture.jpg", 0.0002);
        saturn.translate([this.sunSaturnDist, 0, 0])
        this.planets.push(saturn);

        var uranus = new Planet(scene, uranusRadius, "resources/textures/uranus_texture.jpg", 0.00015);
        uranus.translate([this.sunUranusDist, 0, 0])
        this.planets.push(uranus);

        var neptune = new Planet(scene, neptuneRadius, "resources/textures/neptune_texture.jpg", 0.0001);
        neptune.translate([this.sunNeptuneDist, 0, 0])
        this.planets.push(neptune);

    }

    getPlanets() {
        return this.planets;
    }

    drawOrbits(scene) {
        this.orbits.push(new BasicOrbit(scene, this.sunMercuryDist, this.sunMercuryDist, 0, 0, 0x9370db));
        this.orbits.push(new BasicOrbit(scene, this.sunVenusDist, this.sunVenusDist, 0, 0, 0xcd853f));
        this.orbits.push(new BasicOrbit(scene, this.sunEarthDist, this.sunEarthDist, 0, 0, 0x00ced1));
        this.orbits.push(new BasicOrbit(scene, this.sunMarsDist, this.sunMarsDist, 0, 0, 0xff6247));
        this.orbits.push(new BasicOrbit(scene, this.sunJupiterDist, this.sunJupiterDist, 0, 0, 0xffa07a));
        this.orbits.push(new BasicOrbit(scene, this.sunSaturnDist, this.sunSaturnDist, 0, 0, 0xffdead));
        this.orbits.push(new BasicOrbit(scene, this.sunUranusDist, this.sunUranusDist, 0, 0, 0x87cefa));
        this.orbits.push(new BasicOrbit(scene, this.sunNeptuneDist, this.sunNeptuneDist, 0, 0, 0x1e90ff));
    }

    move() {
        // let numPoints = this.orbits[0].getPoints().length;
        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i].movePlanet(this.orbits[i]);
        }
    }
}