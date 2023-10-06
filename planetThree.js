class PlanetThree{
    constructor(scene, radius, texturePath){

        //initialization
        const loader = new THREE.TextureLoader();

        //loading texture
        const texture = loader.load (texturePath)

        //initializing material
        const material = new THREE.MeshPhongMaterial();

        //setting material property
        material.map = texture;

        const geometry = new THREE.SphereGeometry( radius, 64, 32); 
        const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere );
    }
}