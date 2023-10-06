var pathVertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'varying vec3 fragColor;',
'uniform vec3 uCol;',
'',
'void main()',
'{',
'  fragColor = uCol;',
'  gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var pathFragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

class Path {
    constructor(gl) {

    }


    render(gl) {

    }
}