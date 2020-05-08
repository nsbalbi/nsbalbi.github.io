/*
    Hey, it looks like you're looking for the scripts for my projects. Feel free to copy,
    augment, or make your own version of each. However, please don't copy this website design. 
     - Nick :)
*/

// Curl noise model based on the method outlined in the paper "Curl-Noise for Procedural Fluid Flow" by R. Bridson, J. Hourihan, M. Nordenstam.
// Source: https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

var cursor = {
    x: -99,
    y: -99
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let borderSlider = document.getElementById("border-slider");
let spacingSlider = document.getElementById("spacing-slider");
let startSlider = document.getElementById("start-slider");
let scalingSlider = document.getElementById("scaling-slider");
let simTypeSlider = document.getElementById("simType-slider");

// Particle Object
function Particle(x, y) {
    this.x = x; // x position
    this.y = y; // y position
    this.radius = 2; // Particle radius (side length)
    this.color = "white"; // Particle color

    // Method to draw particle on canvas
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.radius, this.radius);
    }

    // Updates particle position and draws
    this.update = function() {
        // Generate x and y change using curl noise method (Source: https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf)
        var dx = (potential(this.x/scaleFactor,this.y/scaleFactor + displacement,t,this.x,this.y) - potential(this.x/scaleFactor,this.y/scaleFactor - displacement,t,this.x,this.y))/(2*displacement);
        var dy = -(potential(this.x/scaleFactor + displacement,this.y/scaleFactor,t,this.x,this.y) - potential(this.x/scaleFactor - displacement,this.y/scaleFactor,t,this.x,this.y))/(2*displacement);
        // Update positions
        this.x += dx;
        this.y += dy;
        // Call draw method
        this.draw();
    }
}

// Updates mouse coordinates
window.addEventListener("mousemove",
    function(event){
        cursor.x = event.x;
        cursor.y = event.y;
})

// Resets canvas on window resize
window.addEventListener('resize',
    function(event) {
        canvas = document.querySelector('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        reset();
})

// Handles slider inputs

borderSlider.oninput = function() {
    border = parseInt(this.value);
    borderSlider.parentElement.children[0].innerHTML = "Border Size: " + this.value;
}

spacingSlider.oninput = function() {
    spacing = parseInt(this.value);
    spacingSlider.parentElement.children[0].innerHTML = "Particle Spacing: " + this.value;
}

scalingSlider.oninput = function() {
    scaleFactor = parseInt(this.value);
    scalingSlider.parentElement.children[0].innerHTML = "Noise Scaling: " + this.value;
}

startSlider.oninput = function() {
    if (this.value == 1) {
        startType = "grid";
        startSlider.parentElement.children[0].innerHTML = "Start Type: Grid";
    }
    if (this.value == 2) {
        startType = "lines";
        startSlider.parentElement.children[0].innerHTML = "Start Type: Lines";
    }
    if (this.value == 3) {
        startType = "line";
        startSlider.parentElement.children[0].innerHTML = "Start Type: Line";
    }
    if (this.value == 4) {
        startType = "rand";
        startSlider.parentElement.children[0].innerHTML = "Start Type: Random";
    }
}

simTypeSlider.oninput = function() {
    if (this.value == 1) {
        tempSimType = "normal";
        simTypeSlider.parentElement.children[0].innerHTML = "Sim Type: Normal";
    }
    if (this.value == 2) {
        tempSimType = "border";
        simTypeSlider.parentElement.children[0].innerHTML = "Sim Type: Bordered";
    }
    if (this.value == 3) {
        tempSimType = "mouse";
        simTypeSlider.parentElement.children[0].innerHTML = "Sim Type: Mouse Interactive";
    }
}

// Returns potential based on perlin noise
function potential(x,y,t,OGx,OGy) {
    var N = noise.perlin3(x,y,t); // Generate base noise
    if (simType == "normal") { // No modification
        var A = 1; 
    }
    else if (simType == "border") { // Distance to border modification
        var A = ramp(minDistToBorder(OGx,OGy),100);
    }
    else if (simType == "mouse") { // Distance to cursor modificaiton
        var A = cursorRamp(OGx,OGy);
    }
    return A*N; // Return modified noise
}

// Calculate shorest distance to border given x,y
function minDistToBorder(x,y) {
    let dist = [];
    // Push all four border distances
    dist.push(x-border);
    dist.push(canvas.width-border-x);
    dist.push(y-border);
    dist.push(canvas.height-border-y);
    return Math.min(...dist); // Return the smallest
}

// Smooth ramp helper function
function ramp(d,d0) {
    let r = d/d0;
    if (r >= 1) {
        return 1;
    }
    else {
        return 15/8*r - 10/8*r**3 + 3/8*r**5;
    }
}

// Calculate distance between two points
function distBetween(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

// Exponential ramp for cursor effect
function cursorRamp(x,y){
    var dist = distBetween(x,y,cursor.x,cursor.y);
    return 4*2**(-1/50*dist)+1;
}

// Resets particles and model parameters
function reset() {
    noise.seed(Math.random()); // Generate new noise seed
    particles = []; // Clear particles
    xSpawn = canvas.width/2-border; // Range of possible x-coordinates
    ySpawn = canvas.height/2-border; // Range of possible y-coordinates
    simType = tempSimType; // Set simulation type to current slider value
    // Spawn particles for potential initial states
    if (startType == "grid") { // Evenly spaced grid
        for (var i = -xSpawn; i < xSpawn; i+= spacing) {
            for (var j = -ySpawn; j < ySpawn; j+= spacing) {
                particles.push(new Particle(canvas.width/2 + i, canvas.height/2 + j));
            }
        }
    }
    if (startType == "lines") { // Evenly spaced horizontal lines
        for (var i = -xSpawn; i < xSpawn; i+= spacing/3) {
            for (var j = -ySpawn; j < ySpawn; j+= 3*spacing) {
                particles.push(new Particle(canvas.width/2 + i, canvas.height/2 + j));
            }
        }
    }
    if (startType == "line") { // One single center line
        for (var i = -xSpawn; i < xSpawn; i+= spacing/10) {
            particles.push(new Particle(canvas.width/2 + i, canvas.height/2));
        }
    }
    if (startType == "rand") { // Random variations from grid
        for (var i = -xSpawn; i < xSpawn; i+= spacing) {
            for (var j = -ySpawn; j < ySpawn; j+= spacing) {
                particles.push(new Particle(canvas.width/2 + i + spacing*(Math.random()-1), canvas.height/2 + j + spacing*(Math.random()-1)));
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight); // Clear canvas
    // Update particle positions and draw
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    // Increment t
    t += tInt;
}

var t = 0; // Time variable

var startType = "rand"; // Initial state type
var simType = "normal"; // Simulation modification type
var tempSimType = "normal"; // Stores current slider value for simType

let scaleFactor = 500; // Noise scale factor
let displacement = scaleFactor/10000; // Finite difference approximation displacement
let tInt = 0.005; // Time increment between updates

var particles = [];

var spacing = 25;
var border = 0;
var xSpawn = canvas.width/2-border;
var ySpawn = canvas.height/2-border;

noise.seed(Math.random()); // Sets initial noise seed

reset(); // Initialize model
animate(); // Begin animation loop