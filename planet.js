class Planet {
    constructor(gl, program, sphere, scale, textureFile) {
        this.sphere = sphere;
        this.translation = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.modelMatrix = new Float32Array(16);
        mat4.identity(this.modelMatrix);
        this.scale = scale;

        this.posVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.positions), gl.STATIC_DRAW);
        
        this.texVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphere.uvs), gl.STATIC_DRAW);
    
        this.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphere.triangles), gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posVBO);
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(positionAttribLocation);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texVBO);
        var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
        gl.vertexAttribPointer(
            texCoordAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(texCoordAttribLocation);
    
        //
        // Create Texture
        //
    
        // this.texture = textureFile;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                        new Uint8Array([0, 0, 255, 255]));
        // Asynchronously load an image
        var image = new Image();
        image.src = textureFile;
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        this.tex = texture;
    }

    getModelMatrix(){
        const c3 = Math.cos(this.rotation[2]);
        const s3 = Math.sin(this.rotation[2]);
        const c2 = Math.cos(this.rotation[0]);
        const s2 = Math.sin(this.rotation[0]);
        const c1 = Math.cos(this.rotation[1]);
        const s1 = Math.sin(this.rotation[1]);
        return new Float32Array(
            [
                this.scale * (c1 * c3 + s1 * s2 * s3),
                this.scale * (c2 * s3),
                this.scale * (c1 * s2 * s3 - c3 * s1),
                0.0,
      
      
                this.scale * (c3 * s1 * s2 - c1 * s3),
                this.scale * (c2 * c3),
                this.scale * (c1 * c3 * s2 + s1 * s3),
                0.0,
            
                this.scale * (c2 * s1),
                this.scale * (-s2),
                this.scale * (c1 * c2),
                0.0,
            
                this.translation[0], this.translation[1], this.translation[2], 1.0
            ]
        )
    }

    resetMatrix(){
        mat4.identity(worldMatrix);
    }


    translate(vec, scalar) {
        addTo(this.translation, vec, scalar);
    }

    render(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posVBO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texVBO);

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, this.sphere.triangles.length, gl.UNSIGNED_SHORT, 0);
    }
}