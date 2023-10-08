import { Planet } from './planet.js';
import { BasicOrbit } from './basic_orbit.js';


export class SolarSystem {
    constructor(document, scene) {
        const sunscale = 400;
        const scale = 4000;
        const sunRadius =  4.6524e-3 * sunscale; //TODO: Radio multiplicado por 100

        //planets
        const mercuryRadius = 1.6310e-5 * scale*3.5;
        const venusRadius = 4.0454e-5 * scale*3.5;
        const earthRadius = 4.2633e-5 * scale*3.5;
        const marsRadius = 2.2714e-5 * scale*3.5;
        const jupiterRadius = 4.7787e-4 * scale;
        const saturnRadius = 4.0287e-4 * scale;
        const uranusRadius = 1.7085e-4 * scale*2;
        const neptuneRadius = 1.655e-4 * scale*2;

        //dwarf planets
        const ceresRadius = 1.6310e-5 * scale*3.5;
        const plutoRadius = 4.0454e-5 * scale*3.5;
        const makemakeRadius = 4.2633e-5 * scale*3.5;
        const haumeaRadius = 2.2714e-5 * scale*3.5;
        const erisRadius = 2.2714e-5 * scale*3.5;

        this.planets = [];
        this.orbits = [];

        this.currentPosition = 0;

        this.sun = new Planet(document, scene, new BasicOrbit(scene, 0, 0, 0, 0, 0x000000),
            "Sun", 1, sunRadius, "resources/textures/sun_texture.jpg");
	
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 3.87032, 3.78731, 1.59091, 0, 0x9370db, Math.PI/4),
                 "Mercury", 1, mercuryRadius, "resources/textures/mercury_texture.jpg", 0.0008)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 7.23262, 7.23244, 0.09358, 0, 0xcd853f, Math.PI/4),
                "Venus", 1, venusRadius, "resources/textures/venus_texture.jpg", 0.00065)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 10, 9.9985, 0.33422, 0, 0x00ced1, Math.PI/4),
                "Earth", 1, earthRadius, "resources/textures/earth_texture.jpg", 0.0006)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 15.2406, 15.17315, 2.8475, 0, 0xff6247),
                "Mars", 1, marsRadius, "resources/textures/mars_texture.jpg", 0.0005)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 52.0387, 51.97625, 5.0668, 0, 0xffa07a),
                "Jupiter", 1, jupiterRadius, "resources/textures/jupiter_texture.jpg", 0.00025)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 95.72526, 95.5957, 9.9532, 0, 0xffdead),
                "Saturn", 1, saturnRadius, "resources/textures/saturn_texture.jpg", 0.0002)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 191.6477, 191.4359, 17.9612, 0, 0x87cefa),
                "Uranus", 1, uranusRadius, "resources/textures/uranus_texture.jpg", 0.00015)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 301.8048, 301.78972, 5.8689, 0, 0x1e90ff),
                "Neptune", 1, neptuneRadius, "resources/textures/neptune_texture.jpg", 0.0001)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 15.2406, 15.17315, 2.8475, 0, 0xa9a9a9),
                "Ceres", 1, ceresRadius, "resources/textures/ceres_texture.jpg", 0.0025)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 52.0387, 51.97625, 5.0668, 0, 0xa9a9a9),
                "Pluto", 1, plutoRadius, "resources/textures/pluto_texture.jpg", 0.00225)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 95.72526, 95.5957, 9.9532, 0, 0xa9a9a9),
                "Haumea", 1, haumeaRadius, "resources/textures/haumea_texture.jpg", 0.0022)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 191.6477, 191.4359, 17.9612, 0, 0xa9a9a9),
                "Makemake", 1, makemakeRadius, "resources/textures/makemake_texture.jpg", 0.00215)
        )
        this.planets.push(
            new Planet(
                document, scene, new BasicOrbit(scene, 301.8048, 301.78972, 5.8689, 0, 0xa9a9a9),
                "Eris", 1, erisRadius, "resources/textures/eris_texture.jpg", 0.002)
        )
    }

    getPlanets() {
        return this.planets;
    }

    move(time) {
        // let numPoints = this.orbits[0].getPoints().length;
        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i].movePlanet(time);
        }
    }
}