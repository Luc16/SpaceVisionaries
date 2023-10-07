import { Planet } from './planet.js';
import { BasicOrbit } from './basic_orbit.js';


export class SolarSystem {
    constructor(document, scene) {
        const sunscale = 100;
        const scale = 1000;
        const sunRadius =  4.6524e-3 * sunscale; //TODO: Radio multiplicado por 100

        // const mercuryRadius = 0.0035*sunRadius*1;
        // const venusRadius = 0.0087*sunRadius*1;
        // const earthRadius = 0.0092*sunRadius*1;
        // const marsRadius = 0.0049*sunRadius*1;
        // const jupiterRadius = 0.1028*sunRadius*1;
        // const saturnRadius = 0.0866*sunRadius*1;
        // const uranusRadius = 0.0367*sunRadius*1;
        // const neptuneRadius = 0.0356*sunRadius*1;

        const mercuryRadius = 1.6310e-5 * scale;
        const venusRadius = 4.0454e-5 * scale;
        const earthRadius = 4.2633e-5 * scale;
        const marsRadius = 2.2714e-5 * scale;
        const jupiterRadius = 4.7787e-4 * scale;
        const saturnRadius = 4.0287e-4 * scale;
        const uranusRadius = 1.7085e-4 * scale;
        const neptuneRadius = 1.655e-4 * scale;

        this.planets = [];
        this.orbits = [];

        this.currentPosition = 0;

        var sun = new Planet(document, scene, "Sun", sunRadius, "resources/textures/sun_texture.jpg");
	
        var mercury = new Planet(document, scene, "Mercury", mercuryRadius, "resources/textures/mercury_texture.jpg", 0.0008);
        this.planets.push(mercury);

        var venus = new Planet(document, scene, "Venus", venusRadius, "resources/textures/venus_texture.jpg", 0.00065);
        this.planets.push(venus);

        var earth = new Planet(document, scene, "Earth", earthRadius, "resources/textures/earth_texture.jpg", 0.0006);
        this.planets.push(earth);

        var mars = new Planet(document, scene, "Mars", marsRadius, "resources/textures/mars_texture.jpg", 0.0005);
        this.planets.push(mars);

        var jupiter = new Planet(document, scene, "Jupiter", jupiterRadius, "resources/textures/jupiter_texture.jpg", 0.00025);
        this.planets.push(jupiter);

        var saturn = new Planet(document, scene, "Saturn", saturnRadius, "resources/textures/saturn_texture.jpg", 0.0002);
        this.planets.push(saturn);

        var uranus = new Planet(document, scene, "Uranus", uranusRadius, "resources/textures/uranus_texture.jpg", 0.00015);
        this.planets.push(uranus);

        var neptune = new Planet(document, scene, "Neptune", neptuneRadius, "resources/textures/neptune_texture.jpg", 0.0001);
        this.planets.push(neptune);

    }

    getPlanets() {
        return this.planets;
    }

    drawOrbits(scene) {
        this.orbits.push(new BasicOrbit(scene, 3.87032, 3.78731, 1.59091, 0, 0x9370db));
        this.orbits.push(new BasicOrbit(scene, 7.23262, 7.23244, 0.09358, 0, 0xcd853f));
        this.orbits.push(new BasicOrbit(scene, 10, 9.9985, 0.33422, 0, 0x00ced1));
        this.orbits.push(new BasicOrbit(scene, 15.2406, 15.17315, 2.8475, 0, 0xff6247));
        this.orbits.push(new BasicOrbit(scene, 52.0387, 51.97625, 5.0668, 0, 0xffa07a));
        this.orbits.push(new BasicOrbit(scene, 95.72526, 95.5957, 9.9532, 0, 0xffdead));
        this.orbits.push(new BasicOrbit(scene, 191.6477, 191.4359, 17.9612, 0, 0x87cefa));
        this.orbits.push(new BasicOrbit(scene, 301.8048, 301.78972, 5.8689, 0, 0x1e90ff));
    }

    move(time) {
        // let numPoints = this.orbits[0].getPoints().length;
        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i].movePlanet(this.orbits[i], time);
        }
    }
}