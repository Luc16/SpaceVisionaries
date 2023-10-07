import { Planet } from './planet.js';
import { BasicOrbit } from './basic_orbit.js';


export class SolarSystem {
    constructor(scene) {
        const sunRadius =  0.93/2; //TODO: Radio multiplicado por 100

        const mercuryRadius = 0.0035*sunRadius;
        const venusRadius = 0.0087*sunRadius;
        const earthRadius = 0.0092*sunRadius;
        const marsRadius = 0.0049*sunRadius;
        const jupiterRadius = 0.1028*sunRadius;
        const saturnRadius = 0.0866*sunRadius;
        const uranusRadius = 0.0367*sunRadius;
        const neptuneRadius = 0.0356*sunRadius;

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

        var sun = new Planet(scene, sunRadius, "resources/textures/sun_texture.jpg");
	
        var mercury = new Planet(sun.getMesh(), mercuryRadius, "resources/textures/mercury_texture.jpg");
        mercury.translate([this.sunMercuryDist, 0, 0])
        this.planets.push(mercury);

        var venus = new Planet(sun.getMesh(), venusRadius, "resources/textures/venus_texture.jpg");
        venus.translate([this.sunVenusDist, 0, 0])
        this.planets.push(venus);

        var earth = new Planet(sun.getMesh(), earthRadius, "resources/textures/earth_texture.jpg");
        earth.translate([this.sunEarthDist, 0,0])
        this.planets.push(earth);

        var mars = new Planet(scene, marsRadius, "resources/textures/mars_texture.jpg");
        mars.translate([this.sunMarsDist, 0, 0])
        this.planets.push(mars);

        var jupiter = new Planet(scene, jupiterRadius, "resources/textures/jupiter_texture.jpg");
        jupiter.translate([this.sunJupiterDist, 0, 0])
        this.planets.push(jupiter);

        var saturn = new Planet(scene, saturnRadius, "resources/textures/saturn_texture.jpg");
        saturn.translate([this.sunSaturnDist, 0, 0])
        this.planets.push(saturn);

        var uranus = new Planet(scene, uranusRadius, "resources/textures/uranus_texture.jpg");
        uranus.translate([this.sunUranusDist, 0, 0])
        this.planets.push(uranus);

        var neptune = new Planet(scene, neptuneRadius, "resources/textures/neptune_texture.jpg");
        neptune.translate([this.sunNeptuneDist, 0, 0])
        this.planets.push(neptune);

    }

    drawOrbits(scene) {
        this.orbits.push(new BasicOrbit(scene, this.sunMercuryDist, this.sunMercuryDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunVenusDist, this.sunVenusDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunEarthDist, this.sunEarthDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunMarsDist, this.sunMarsDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunJupiterDist, this.sunJupiterDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunSaturnDist, this.sunSaturnDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunUranusDist, this.sunUranusDist, 0, 0));
        this.orbits.push(new BasicOrbit(scene, this.sunNeptuneDist, this.sunNeptuneDist, 0, 0));
    } 
}