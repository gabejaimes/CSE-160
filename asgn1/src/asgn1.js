// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;  // uniform
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global Vars
let canvas;
let gl;
let a_Position;
let u_Size;
let u_FragColor;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  }

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (u_Size < 0) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
  
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }
  }

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI Elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 20;
let g_selectedType = POINT;
let g_selectedSegments = 8;


function addActionsForHtmlUI() {
  // get slider vars
  const r = document.getElementById("redSlide");
  const g = document.getElementById("greenSlide");
  const b = document.getElementById("blueSlide");
  const sizeSlider = document.getElementById("sizeSlide");
  const segmentsSlider = document.getElementById("segmentsSlide");
  // helper func for updating slider values and making them absolute
  function updateColorFromSliders() {
    g_selectedColor = [r.value / 100, g.value / 100, b.value / 100, 1.0];
  }

  // Button Events
  // document.getElementById("green").onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById("red").onclick =   function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById("clearButton").onclick = function() { g_shapesList = []; renderAllShapes();};

  document.getElementById("pointButton").onclick = function() { g_selectedType = POINT; };
  document.getElementById("triButton").onclick = function() { g_selectedType = TRIANGLE; };
  document.getElementById("circleButton").onclick = function() { g_selectedType = CIRCLE; };

  // Slider Events
  r.addEventListener("mouseup", updateColorFromSliders);
  g.addEventListener("mouseup", updateColorFromSliders);
  b.addEventListener("mouseup", updateColorFromSliders);
  sizeSlider.addEventListener("mouseup", function() { g_selectedSize = this.value; });
  segmentsSlider.addEventListener("mouseup", function() { g_selectedSegments = this.value; });

  // USE ONLY IF NOT HARDCODED TO SYNC WHAT COLORS WERE INIT AS IN HTML
  // updateColorFromSliders();
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  // Do actions for HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes  = [];


function click(ev) {
  const [x,y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType === POINT) {
    point = new Point();
  } else if (g_selectedType === TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType === CIRCLE) {
    point = new Circle();
  }

  point.position = [x,y];
  point.color    = g_selectedColor.slice();
  point.size     = g_selectedSize;
  if (g_selectedType === CIRCLE) {
    point.segments = g_selectedSegments;
  }
  g_shapesList.push(point);


  // Draw every shape
  renderAllShapes();
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;

  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer

  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return ([x,y]);
}
