/*
    Hey, it looks like you're looking for the scripts for my projects. Feel free to copy,
    augment, or make your own version of each. However, please don't copy this website design. 
     - Nick :)
*/
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

var thetaSlider = document.getElementById("theta-slider");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var center_x = canvas.width/2; // Center x of screen
var center_y = canvas.height/2 + 300; // Center y of screen

function Point(x, y, parentID, hasChild, color){
    this.x = x; // x coord
    this.y = y; // y coord
    this.parentID = parentID; // ID of parent point, -1 if none
    this.hasChild = hasChild; // Boolean representing if the point has a child
    this.radius = 1; // Point radius
    this.color = color; // Point color

    this.draw = function() {
        // Draws a line between the point and its parent if it has not been drawn before
        if (!this.hasChild) {
            c.beginPath();
            c.moveTo(pointArray[this.parentID].x  + center_x, pointArray[this.parentID].y + center_y);
            c.lineTo(this.x  + center_x, this.y + center_y);
            c.strokeStyle = this.color;
            c.stroke();
        }
    }
}

// Helper function that returns the distance between two points
function distBetween(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function reset() {
    c.clearRect(0, 0, innerWidth, innerHeight);
    pointArray = [];
    pointArray.push(new Point(0, 0, -1, true, 'white'));
    pointArray.push(new Point(0, -200, 0, false, 'white'));
    for (var i = 0; i < pointArray.length; i++) {
        pointArray[i].draw();
    }
    iterationCount = 0;
}

// Creates another iteration of points
function iterate() {
    // Records number of current points
    var loopMax = pointArray.length;
    // Loops through each current point
    for (var i = 0; i < loopMax; i++) {
        // Creates new points if the current point has no children
        if (pointArray[i].hasChild == false) {
            // Records length of parent
            var lengthParent = distBetween(pointArray[i].x, pointArray[i].y, pointArray[pointArray[i].parentID].x, pointArray[pointArray[i].parentID].y);
            // Records parent coordinates
            var xPrev = pointArray[i].x - pointArray[pointArray[i].parentID].x;
            var yPrev = pointArray[i].y - pointArray[pointArray[i].parentID].y;
            // Creates child pointd by first creating a point in the same direction as the parent, then rotation the point by theta
            var xNew1 = lengthParent*(-xPrev*Math.cos(theta)-yPrev*Math.sin(theta))/(scaleFactor*Math.sqrt(xPrev**2+yPrev**2)) + xPrev + pointArray[pointArray[i].parentID].x;
            var yNew1 = lengthParent*(xPrev*Math.sin(theta)-yPrev*Math.cos(theta))/(scaleFactor*Math.sqrt(xPrev**2+yPrev**2)) + yPrev + pointArray[pointArray[i].parentID].y;
            var xNew2 = lengthParent*(-xPrev*Math.cos(-theta)-yPrev*Math.sin(-theta))/(scaleFactor*Math.sqrt(xPrev**2+yPrev**2)) + xPrev + pointArray[pointArray[i].parentID].x;
            var yNew2 = lengthParent*(xPrev*Math.sin(-theta)-yPrev*Math.cos(-theta))/(scaleFactor*Math.sqrt(xPrev**2+yPrev**2)) + yPrev + pointArray[pointArray[i].parentID].y;
            // Adds new points to array
            pointArray.push(new Point(xNew1, yNew1, i, false, 'white'));
            pointArray.push(new Point(xNew2, yNew2, i, false, 'white'));
            // Sets hasChild to true for the new parent so it does not have more kids
            pointArray[i].hasChild = true;
        }
    }
    // Draws the new lines
    for (var i = 0; i < pointArray.length; i++) {
        pointArray[i].draw();
    }
}

// Creates a new iteration of points when clicking (to a max)
window.addEventListener('mousedown', 
    function(event) {
        if (event.y < canvas.height*0.90) {
            if (iterationCount < 12) {
                iterate();
            }
            iterationCount++;
        }
})

thetaSlider.oninput = function() {
    theta = this.value*Math.PI/180;
}

var pointArray = [];

var theta = 14*Math.PI/16; // Rotation of new lines, must be between Pi/2 and Pi
var scaleFactor = 1.5; // Reduces length of new lines, must be > 1
var iterationCount = 0; // Current number of iterations

// Creates ititial points
pointArray.push(new Point(0, 0, -1, true, 'white'));
pointArray.push(new Point(0, -200, 0, false, 'white'));
 
// Draws initial points
for (var i = 0; i < pointArray.length; i++) {
    pointArray[i].draw();
}