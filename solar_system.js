import { Planet } from './planet.js';

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

        const sunMercuryDist = 0.39;
        const sunVenusDist = 0.72;
        const sunEarthDist = 1;
        const sunMarsDist = 1.52;
        const sunJupiterDist = 5.2;
        const sunSaturnDist = 9.54;
        const sunUranusDist = 19.2;
        const sunNeptuneDist = 30.06;


        var sun = new Planet(scene, sunRadius, "resources/textures/sun_texture.jpg");
	
        var mercury = new Planet(scene, mercuryRadius, "resources/textures/mercury_texture.jpg");
        mercury.translate([sunMercuryDist, 0, 0])

        var venus = new Planet(scene, venusRadius, "resources/textures/venus_texture.jpg");
        venus.translate([sunVenusDist, 0, 0])

        var earth = new Planet(scene, earthRadius, "resources/textures/earth_texture.jpg");
        earth.translate([sunEarthDist, 0,0])

        var mars = new Planet(scene, marsRadius, "resources/textures/mars_texture.jpg");
        mars.translate([sunMarsDist, 0, 0])

        var jupiter = new Planet(scene, jupiterRadius, "resources/textures/jupiter_texture.jpg");
        jupiter.translate([sunJupiterDist, 0, 0])

        var saturn = new Planet(scene, saturnRadius, "resources/textures/saturn_texture.jpg");
        saturn.translate([sunSaturnDist, 0, 0])

        var uranus = new Planet(scene, uranusRadius, "resources/textures/uranus_texture.jpg");
        uranus.translate([sunUranusDist, 0, 0])

        var neptune = new Planet(scene, neptuneRadius, "resources/textures/neptune_texture.jpg");
        neptune.translate([sunNeptuneDist, 0, 0])
    }
}