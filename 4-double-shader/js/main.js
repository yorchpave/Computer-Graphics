"use strict"

// global variables
var canvas;
var gl;
var positions1, positions2;
var colors;	// triangle 2
var color;	// triangle 1
var shaderProgram1, shaderProgram2;
var aPosition1, aPosition2, aColor, uColor;
var vboPosition1, vboPosition2, vboColor;

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
	positions1 = [-0.5, 0.5, // V0
			     -0.5, -0.5,// v1
				  0.5, -0.5	// V2
				];

	positions2 = [-0.5, 0.5, // V0
			      0.5, -0.5,// v2
				  0.5, 0.5	// V3
				];

	colors = [1., 0., 0., 1.,
	          0., 1., 0., 1.,
	          0., 0., 1., 1.];

	color = [1., 0., 0., 1.];
}

function initShaders()
{
	// Shader Program 1
	// Get Source for vertex & fragment shaders
	var vertexShaderSrc = document.getElementById("shaderSingleColor-vs").text;
	var fragmentShaderSrc = document.getElementById("shader-fs").text;

	// Create GLSL shaders (upload source & compile shaders)
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

	// Link the two shaders into a shader program
	shaderProgram1 = createShaderProgram(gl, vertexShader, fragmentShader);

	// Shader Program 2
	// Get Source for vertex & fragment shaders
	var vertexShaderSrc = document.getElementById("shaderMultiColor-vs").text;
	var fragmentShaderSrc = document.getElementById("shader-fs").text;

	// Create GLSL shaders (upload source & compile shaders)
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

	// Link the two shaders into a shader program
	shaderProgram2 = createShaderProgram(gl, vertexShader, fragmentShader);

	// Look up into the vertex shader where the CPU's vertex data go
	aPosition1 = gl.getAttribLocation(shaderProgram1, "aPosition");
	aPosition2 = gl.getAttribLocation(shaderProgram2, "aPosition");
	aColor = gl.getAttribLocation(shaderProgram2, "aColor");
	uColor = gl.getUniformLocation(shaderProgram1, "uColor");
}

function initBuffers()
{
	// Positions' VBO Triangle 1
	// Create a GPU's Vertex Buffer Object (VBO) and put clip-space vertex data 
	vboPosition1 = gl.createBuffer();

	// Bind the VBO to ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition1);

	// Upload CPU's vertex data into the GPU's VBO
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions1), gl.STATIC_DRAW);

	// Positions' VBO Triangle 2
	// Create a GPU's Vertex Buffer Object (VBO) and put clip-space vertex data 
	vboPosition2 = gl.createBuffer();

	// Bind the VBO to ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition2);

	// Upload CPU's vertex data into the GPU's VBO
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);


	// Colors' VBO Triangle 2
	// Create a GPU's Vertex Buffer Object (VBO) and put clip-space vertex data 
	vboColor = gl.createBuffer();

	// Bind the VBO to ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);

	// Upload CPU's vertex data into the GPU's VBO
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

function renderScene()
{
	// Clear the framebuffer (canvas)
	gl.clear(gl.COLOR_BUFFER_BIT);
				
	// Mapping from clip-space coords to the viewport in pixels
	gl.viewport(0, 0, canvas.width, canvas.height);
				
	// Tell WebGL which shader program to use (vertex & fragments shaders)
	gl.useProgram(shaderProgram1);

	// Load uniform data to GPU
	gl.uniform4fv(uColor, color);

	// Positions Triangle 1 Layout				
	// Turn on the attribute variable
	gl.enableVertexAttribArray(aPosition1);
				
	// Bind to a VBO
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition1);
				
	// Tell the attribute (in) how to get data out of VBO
	var size = 2;			// 2 elements (x, y) per iteration
	var type = gl.FLOAT;	// 32 bit floats
	var normalize = false; 	// do not normalize the data
	var stride = 0;			// move forward size*sizeof(type) each iter to get next pos
	var offset = 0;			// start at the beginning of the VBO
	gl.vertexAttribPointer(aPosition1, size, type, normalize, stride, offset);

	// Draw the scene
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 3;	
	gl.drawArrays(primitiveType, offset, count);

	// Tell WebGL which shader program to use (vertex & fragments shaders)
	gl.useProgram(shaderProgram2);

	// Positions Triangle 2 Layout				
	// Turn on the attribute variable
	gl.enableVertexAttribArray(aPosition2);
				
	// Bind to a VBO
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPosition2);
				
	// Tell the attribute (in) how to get data out of VBO
	var size = 2;			// 2 elements (x, y) per iteration
	var type = gl.FLOAT;	// 32 bit floats
	var normalize = false; 	// do not normalize the data
	var stride = 0;			// move forward size*sizeof(type) each iter to get next pos
	var offset = 0;			// start at the beginning of the VBO
	gl.vertexAttribPointer(aPosition2, size, type, normalize, stride, offset);
				
	// Colors Triangle 2 Layout				
	// Turn on the attribute variable
	gl.enableVertexAttribArray(aColor);
				
	// Bind to a VBO
	gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
				
	// Tell the attribute (in) how to get data out of VBO
	var size = 4;			// 4 elements (r, g, b, a) per iteration
	var type = gl.FLOAT;	// 32 bit floats
	var normalize = false; 	// do not normalize the data
	var stride = 0;			// move forward size*sizeof(type) each iter to get next pos
	var offset = 0;			// start at the beginning of the VBO
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
