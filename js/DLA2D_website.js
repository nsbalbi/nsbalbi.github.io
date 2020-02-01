/*
    Hey, it looks like you're looking for the scripts for my projects. Feel free to copy,
    augment, or make your own version of each. However, please don't copy this website design. 
     - Nick :)
*/
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'white';

// Create Object with Draw and Update Functions Here
function Point(x, y){
    this.x = x; // x Coord
    this.y = y; // y Coord
    this.edge = 1; // Point size

    // Draws point
    this.draw = function() {
        c.beginPath();
        c.fillRect(this.x + center_x, this.y + center_y, this.edge, this.edge);
    }
}

// Checks for point collision/intersection
function checkCollision(x, y) {
    for (var i = 0; i < pointArray.length; i++) {
        if (pointArray[i].x == x & pointArray[i].y == y) {
            return true;
        }
    }
    return false;
}

// Adds a new point
function iterate() {
    // Chooses to start on x or y boundary
    var XoY = Math.round(Math.random());
    if (XoY == 0) { // If x is chosen then it lies on either x bound and y is randomized
        var xStart = (2*Math.round(Math.random())-1)*spawnRadius;
        var yStart = Math.round(2*spawnRadius*Math.random()-spawnRadius);
    }
    else {
        var xStart = Math.round(2*spawnRadius*Math.random()-spawnRadius);
        var yStart = (2*Math.round(Math.random())-1)*spawnRadius;
    }
    var x = xStart; // Records starting x position
    var y = yStart; // Records starting y position
    var dx = 0; // Current step x magnitude
    var dy = 0; // Current step y magnitude
    // Moves particle until it collides with another
    while (!checkCollision(x, y)){
        // Chooses to move in x or y direction
        XoY = Math.round(Math.random()); 
        if (XoY == 0) { // If x is chosen than it goes left or right by one
            dx = 2*Math.round(Math.random())-1;
            dy = 0;
        }
        else { // If x is chosen than it goes up or down by one
            dx = 0;
            dy = 2*Math.round(Math.random())-1;
        }
        // Increments position
        x += dx;
        y += dy;
        // If the particle moves outside the spawn radius, move it back to the start position
        if (Math.abs(x) > spawnRadius || Math.abs(y) > spawnRadius){
            x = xStart;
            y = yStart;
        }
    }
    // Decrements x and y if there was a collision
    x -= dx;
    y -= dy;
    // Pushes the new point
    pointArray.push(new Point(x, y));
    // Draws the new point
    pointArray[pointArray.length-1].draw();
    // Increases the spawn radius if the new point is farther from the center than all other points
    if (Math.abs(x) >= spawnRadius-1 || Math.abs(y) >= spawnRadius-1) {
        spawnRadius += 1;
    }
}

var center_x = canvas.width/2; // x center of the canvas
var center_y = canvas.height/2; // y center of the canvas

var pointArray = [];
var spawnRadius = 3; // Starting spawn radius 

pointArray.push(new Point(0, 0));
pointArray[0].draw();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    iterate();
}

// Begins animation loop
animate();