/*
    Hey, it looks like you're looking for the scripts for my projects. Feel free to copy,
    augment, or make your own version of each. However, please don't copy this website design. 
     - Nick :)
*/
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Point(x, y, z, parentID, hasChild, color){
    this.x = x; // x Coord
    this.y = y; // y Coord
    this.z = z; // z Coord
    this.parentID = parentID; // ID of parent point (poisition in array)
    this.hasChild = hasChild; // Boolean representing if there is a point with this point as its parent
    this.radius = 1; // Point radius
    this.color = color; // Point color

    this.draw = function() {
        // Draws a line between this point and its parent if it has one
        if (this.parentID != -1) {
            c.beginPath();
            c.moveTo(pointArray[this.parentID].x  + center_x - scaleFactor*zOffsetX*pointArray[this.parentID].z, pointArray[this.parentID].y + center_y + scaleFactor*zOffsetY*pointArray[this.parentID].z);
            // Offsets x and y by z and a scale factor to create illusion of 3D
            c.lineTo(this.x  + center_x - scaleFactor*zOffsetX*this.z, this.y + center_y + scaleFactor*zOffsetY*this.z);
            c.strokeStyle = this.color;
            c.stroke();
        }
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

// Helper function that return the distance between two points
function distBetween(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

// Helper function that rotates a point about a given axis by theta degrees
function rotation3D(x, y, z, uX, uY, uZ, theta) {
    var C = Math.cos(theta);
    var S = Math.sin(theta);
    var t = 1 - Math.cos(theta);
    var xOut = x*(t*uX**2 + C) + y*(t*uX*uY - S*uZ) + z*(t*uX*uZ + S*uY);
    var yOut = x*(t*uX*uY + S*uZ) + y*(t*uY**2 + C) + z*(t*uY*uZ - S*uX);
    var zOut = x*(t*uX*uZ - S*uY) + y*(t*uY*uZ + S*uX) + z*(t*uZ**2 + C);
    return [xOut,yOut,zOut];
}

// Helper function that returns the cross product of two vectors
function crossProd(x1, y1, z1, x2, y2, z2) {
    return [y1*z2-y2*z1, x2*z1-x1*z2, x1*y2-x2*y1];
}

// Helper function that returns a unit vector in the direction of the input vector
function unitVector(x, y, z) {
    var mag = Math.sqrt(x**2 + y**2 + z**2);
    return [x/mag, y/mag, z/mag];
}

// Creates a new set of points
function iterate() {
    var loopMax = pointArray.length;
    // Loops through each current point
    for (var i = 0; i < loopMax; i++) {
        // Creates a new point if the current point has no children
        if (pointArray[i].hasChild == false) {
            // Stores length of parent line
            var lengthParent = distBetween(pointArray[i].x, pointArray[i].y, pointArray[i].z, pointArray[pointArray[i].parentID].x, pointArray[pointArray[i].parentID].y, pointArray[pointArray[i].parentID].z);
            // Stores coordinates of parent point
            var xPrev = pointArray[i].x - pointArray[pointArray[i].parentID].x;
            var yPrev = pointArray[i].y - pointArray[pointArray[i].parentID].y;
            var zPrev = pointArray[i].z - pointArray[pointArray[i].parentID].z;
            // Creates a new point in the direction of the parent line, with a fraction of the parent line length
            var rPrimeMag = Math.sqrt(xPrev**2 + yPrev**2 + zPrev**2);
            var rPrime = [(lengthParent*xPrev)/(scaleFactor*rPrimeMag), (lengthParent*yPrev)/(scaleFactor*rPrimeMag), (lengthParent*zPrev)/(scaleFactor*rPrimeMag)];
            for (var k = 0; k < numBranches; k++) {
                // Creates a random unit vector
                var randVect = [Math.random()-0.5, Math.random()-0.5, Math.random()-0.5];
                // Creates a random perpendicular unit vector to rPrime by crossing with the random unit vector
                var randCrossed = crossProd(randVect[0], randVect[1], randVect[2], rPrime[0], rPrime[1], rPrime[2]);
                randCrossed = unitVector(randCrossed[0], randCrossed[1], randCrossed[2]);
                // Rotates rPrime about the random perpendicular vector by theta degrees
                var newVect = rotation3D(rPrime[0],rPrime[1],rPrime[2],randCrossed[0],randCrossed[1],randCrossed[2],theta);
                // Creates the new point
                pointArray.push(new Point(newVect[0]+xPrev+pointArray[pointArray[i].parentID].x, newVect[1]+yPrev+pointArray[pointArray[i].parentID].y, newVect[2]+zPrev+pointArray[pointArray[i].parentID].z, i, false, 'white'));
            }
            // Sets parent hasChild value to true so it can't have more kids
            pointArray[i].hasChild = true;
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // Clears Frame
    c.clearRect(0, 0, innerWidth, innerHeight);

    // Updates/redraws points
    for (var i = 0; i < pointArray.length; i++) {
        pointArray[i].update();
    }
}

// Adds another iteration of points when the mouse is clicked
window.addEventListener('mousedown', 
    function(event) {
        if (iterationCount < 7) {
            iterate();
        }
        iterationCount++;
})

var pointArray = [];

var center_x = canvas.width/2; // Center of the screen
var center_y = canvas.height/2+200; // Center of the screen offset by 200 to lower the tree base
var zOffsetX = 0.75; // z offset for x for 3D effect
var zOffsetY = 0.25; // z offset for y for 3D effect

// Rotation Angle (Normal Speeds are ~0.01)
var pitch = 0.01; // Beta, Rotation around Y
var sinPitch = Math.sin(pitch); // Removes unnecessary calculations each frame
var cosPitch = Math.cos(pitch); // "

var theta = 2*Math.PI/16; // Must be between Pi/2 and 0
var scaleFactor = 1.5; // Must be > 1
var numBranches = 3; // Number of branches added per point, per iteration
var iterationCount = 0; // Current number of iterations

// Sets initial points ("trunk")
pointArray.push(new Point(0, 0, 0, -1, true, 'white'));
pointArray.push(new Point(0, -150, 0, 0, false, 'white'));

// Begins animation loop
animate();