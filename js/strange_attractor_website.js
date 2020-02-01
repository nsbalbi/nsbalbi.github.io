/*
    Hey, it looks like you're looking for the scripts for my projects. Feel free to copy,
    augment, or make your own version of each. However, please don't copy this website design. 
     - Nick :)
*/
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create Object with Draw and Update Functions
function Point(x, y, z, radius, color){
    this.x = x; // x Coord
    this.y = y; // y Coord
    this.z = z; // z Coord
    this.radius = radius; // Point radius
    this.color = color; // Point color

    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        // Draws Points, Shifts to Center of Screen and Offsets Depending on Z Value
        c.fillRect(scaleFactor*this.x + center_x - scaleFactor*zOffsetX*this.z, scaleFactor*this.y + center_y + scaleFactor*zOffsetY*this.z, this.radius, this.radius);
    }

    this.update = function (){
        if (pitch!=0){
            // Record Prev Values for Calculation
            x = this.x;
            y = this.y;
            z = this.z;
            // Multiplication with Rotation Matrix about Y-Axis Only
            this.x = x*cosPitch - z*sinPitch; 
            this.z = x*sinPitch + z*cosPitch;
        }
        this.draw();
    }
}

function animate() {
    requestAnimationFrame(animate);
    // Clears Frame
    c.clearRect(0, 0, innerWidth, innerHeight);
    // Updates/redraws points
    for (var i = 0; i < pointArray.length; i++) {
        pointArray[i].update();
    }

    // Draw Background Axes
    c.beginPath();
    c.moveTo(center_x, 0);
    c.lineTo(center_x, canvas.height);
    c.strokeStyle = "grey";
    c.stroke();
    c.beginPath();
    c.moveTo(0, center_y);
    c.lineTo(canvas.width, center_y);
    c.stroke();
    c.beginPath();
    c.moveTo(center_x+zOffsetX*1000, center_y-zOffsetY*1000);
    c.lineTo(center_x-zOffsetX*1000, center_y+zOffsetY*1000);
    c.stroke();
}

// Init

// Offsets for Center
var center_x = canvas.width/2;
var center_y = canvas.height/2;
// Offset for Visualizing Z
var zOffsetX = 0.75;
var zOffsetY = 0.25;

// Rotation Angle (Normal Speeds are ~0.01)
var pitch = 0.01; // Beta, Rotation around Y
var sinPitch = Math.sin(pitch); // Removes unnecessary calculations each frame
var cosPitch = Math.cos(pitch); // "

// Attractor Values

// Rossler
/* var sigma = 0.2;
var beta = 0.2;
var rho = 5.7; */

// Thomas'
//var beta = 0.208186; // Thomas' (Chaotic)
var beta = 0.12; // Thomas' (Looks Cool)

var t = 0; // Current time
var tInt = 0.002; // Time Increment Between Each Iteration (Not Point)

var scaleFactor = 50; // "Zoom" of Graph
var numLines = 50; // Number of Inital Points Sampled and Number of Resulting "Lines" Drawn
var numPoints = 250; // Number of Points per Line
var iterPerPoint = 100; // Number of Increment Calculations between Points

var tTotal = tInt*numPoints*iterPerPoint; // Total Time Elapsed over a Line

var pointArray = [];
for (var i = 0; i < numLines; i++) { // Per Line
    // Random Generation of Starting Points
    var xGen = 2*Math.random()-1;
    var yGen = 2*Math.random()-1;
    var zGen = 2*Math.random()-1;
    t = 0; // t is Reset to 0 Each Line
    for (var j = 0; j < numPoints; j++) { // Per Point
        for (var k = 0; k < iterPerPoint; k++) { // Per Increment
            // Recording Previous Values for Calculation
            xPrev = xGen;
            yPrev = yGen;
            zPrev = zGen;

            // Differential Calculation Using Euler's Method
            
            // Rossler
            /* xGen += -tInt*(yPrev + zPrev);
            yGen += tInt*(xPrev + sigma * yPrev);
            zGen += tInt*(beta + xPrev * zPrev - rho * zPrev); */

            // Thomas' Cyclically Symettric Attractor
            xGen += tInt*(Math.sin(yPrev) - beta*xPrev);
            yGen += tInt*(Math.sin(zPrev) - beta*yPrev);
            zGen += tInt*(Math.sin(xPrev) - beta*zPrev);

            t += tInt; // t Increment
        }
        // Adds Point (Color Changes Depending on How Much Time has Elapsed)
        pointArray.push(new Point(xGen, yGen, zGen, 2, 'rgb(255,'+t/tTotal*255+',115)'));
    }
}

animate();