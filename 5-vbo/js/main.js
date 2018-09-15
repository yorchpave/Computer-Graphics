"use strict"

// global variables
var canvas;
var gl;
var vertices;	// positions & colors
var shaderProgram;
var aPosition, aColor;
var vbo;

function initRenderingContext()
{
	canvas = document.getElementById("canvas");
	// Get a WebGL Context
	gl = canvas.getContext("webgl");
	if(gl)
	{
		// Set the clear Color
		gl.clearColor(0., 0., 0., 1.);	// black
	}
	return gl;
}

function initScene()
{
	vertices = [ 0., 0.5, 1., 0., 0., 1., 	// V0: (x, y, r, g, b, a)
			    -0.5, -0.5, 0., 1., 0., 1., // v1
				 0.5, -0.5, 0., 0., 1., 1.	// V2
				];
}

function initShaders()
{
	// Get Source for vertex & fragment shaders
	var vertexShaderSrc = document.getElementById("shader-vs").text;
	var fragmentShaderSrc = document.getElementById("shader-fs").text;

	// Create GLSL shaders (upload source & compile shaders)
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

	// Link the two shaders into a shader program
	shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);

	// Look up into the vertex shader where the CPU's vertex data go
	aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
	aColor = gl.getAttribLocation(shaderProgram, "aColor");
}

function initBuffers()
{
	// Create a GPU's Vertex Buffer Object (VBO) and put clip-space vertex data 
	vbo = gl.createBuffer();

	// Bind the VBO to ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

	// Upload CPU's vertex data into the GPU's VBO
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function renderScene()
{
	// Clear the framebuffer (canvas)
	gl.clear(gl.COLOR_BUFFER_BIT);
				
	// Mapping from clip-space coords to the viewport in pixels
	gl.viewport(0, 0, canvas.width, canvas.height);
				
	// Tell WebGL which shader program to use (vertex & fragments shaders)
	gl.useProgram(shaderProgram);
				
	// Turn on the attribute variable
	gl.enableVertexAttribArray(aPosition);
				
	// Bind to a VBO
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				
	// Tell the attribute (in) how to get data out of VBO
	var size = 2;			// 2 elements (x, y) per iteration
	var type = gl.FLOAT;	// 32 bit floats
	var normalize = false; 	// do not normalize the data
	var stride = (2 + 4)*4;			// move forward size*sizeof(type) each iter to get next pos
	var offset = 0;			// start at the beginning of the VBO
	gl.vertexAttribPointer(aPosition, size, type, normalize, stride, offset);

	// Turn on the attribute variable
	gl.enableVertexAttribArray(aColor);
				
	// Bind to a VBO
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				
	// Tell the attribute (in) how to get data out of VBO
	var size = 4;			// 2 elements (x, y) per iteration
	var type = gl.FLOAT;	// 32 bit floats
	var normalize = false; 	// do not normalize the data
	var stride = (2 + 4)*4;			// move forward size*sizeof(type) each iter to get next pos
	var offset = 2 * 4;			// start at the beginning of the VBO
	gl.vertexAttribPointer(aColor, size, type, normalize, stride, offset);
				
				
	// Draw the scene
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 3;	
	gl.drawArrays(primitiveType, offset, count);
}

function main()
{
	// Initialization code
	gl = initRenderingContext();
	if(!gl)
	{
		return;
	}
	else
	{
		initScene();
		initShaders();
		initBuffers();

		// Rendering code
		renderScene();
	}
}
