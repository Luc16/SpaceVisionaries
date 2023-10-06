
function inverseLerp(start, end, value) {
	return (value - start) / (end - start);
}

function latLngToCartesian([radius, lat, lng]){
	lng = -lng + Math.PI / 2;
	return [
		radius * Math.cos(lat) * Math.cos(lng),
		radius * Math.sin(lat),
		radius * -Math.cos(lat) * Math.sin(lng),
	];
}
const TWO_PI = Math.PI * 2
const QUARTER_TURN = Math.PI / 2;

function createSphere(density){
	const radsPerUnit = Math.PI / density;
	const sliceVertCount = density * 2;

	//positions and UVs
	const positions = [];
	const uvs = [];
	let latitude = -Math.PI / 2;
	//latitude
	for(let i = 0; i <= density; i++){
		const v = inverseLerp(-QUARTER_TURN, QUARTER_TURN, -latitude);
		let longitude = 0;
		let vertLength = sliceVertCount + ((i > 0 && i < density) ? 1 : 0); //middle rings need extra vert for end U value
		//longitude
		for (let j = 0; j < vertLength; j++) {
			positions.push(latLngToCartesian([1, latitude, longitude]));
			uvs.push([inverseLerp(0, TWO_PI, longitude), v]);
			longitude += radsPerUnit;
		}
		latitude += radsPerUnit;
	}

	//colors
	const colors = [];
	for(let i = 0; i < positions.length; i++){
		colors.push([1, 1, 0]);
	}

	//triangles
	const triangles = [];
	let ringStartP = 0;
	for(let ring = 0; ring < density; ring++){ // start at first ring
		const vertexBump = (ring > 0 ? 1 : 0);
		for (let sliceVert = 0; sliceVert < sliceVertCount; sliceVert++){
			const thisP = ringStartP + sliceVert;
			const nextP = ringStartP + sliceVert + 1;
			const nextRingP = thisP + sliceVertCount + vertexBump;
			const nextRingNextP = nextP + sliceVertCount + vertexBump;

			if(ring === 0){
				triangles.push([thisP, nextRingNextP, nextRingP]);
			}
			if(ring === density - 1){
				triangles.push([thisP, nextP, nextRingP]);
			}
			if(ring > 0 && ring < density - 1 && density > 2){
				triangles.push([thisP, nextRingNextP, nextRingP])
				triangles.push([thisP, nextP, nextRingNextP])
			}
		}
		if(ring === 0){
			ringStartP += sliceVertCount;
		} else {
			ringStartP += sliceVertCount + 1;
		}
	}


	return {
		positions: positions.flat(),
		colors: colors.flat(),
		triangles: triangles.flat(),
		uvs: uvs.flat(),
		normals: positions.flat(),
		textureName: "earth"
	};
}