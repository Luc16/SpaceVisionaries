class Planet {
    constructor(gl, program, sphere, scale, textureFile) {
        this.sphere = sphere;
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
        var model = new Float32Array(16);
        mat4.scale(model, this.modelMatrix, [this.scale, this.scale, this.scale]);
        return model;
    }

    resetMatrix(){
        mat4.identity(worldMatrix);
    }

    rotate(angle, axis){
        mat4.rotate(this.modelMatrix, this.modelMatrix, angle, axis);
    }

    translate(vec) {
        mat4.translate(this.modelMatrix, this.modelMatrix, vec);
    }

    render(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posVBO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texVBO);

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, this.sphere.triangles.length, gl.UNSIGNED_SHORT, 0);
    }
}