/*
    Hey, it looks like you're looking for the scripts for my projects. Feel free to copy,
    augment, or make your own version of each. However, please don't copy this website design. 
     - Nick :)
*/

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Store website elements for future reference
var images = [];
images.push(document.getElementById("3D-fractal-tree-crop-img"));
images.push(document.getElementById("strange-attractor-crop-img"));
images.push(document.getElementById("2D-DLA-crop-img"));
images.push(document.getElementById("2D-fractal-tree-crop-img"));
images.push(document.getElementById("about-crop-img"));
images.push(document.getElementById("mass-spring-crop-img"));

var infoDisplays = [];
infoDisplays.push(document.getElementById('3D-fractal-tree'));
infoDisplays.push(document.getElementById('strange-attractor'));
infoDisplays.push(document.getElementById('2D-DLA'));
infoDisplays.push(document.getElementById('2D-fractal-tree'));
infoDisplays.push(document.getElementById('about'));
infoDisplays.push(document.getElementById('mass-spring'));

var infoLinks = [];
infoLinks.push(document.getElementById('3D-fractal-tree-link'));
infoLinks.push(document.getElementById('strange-attractor-link'));
infoLinks.push(document.getElementById('2D-DLA-link'));
infoLinks.push(document.getElementById('2D-fractal-tree-link'));
infoLinks.push(document.getElementById('about-blank-link'));
infoLinks.push(document.getElementById('mass-spring-link'));

var cursor = [undefined, undefined]; // Stores cursor coordinates
var displayedID = undefined; // Stores ID of "circle" currently dispayed
var paused = false; // Stores animation pause state

// Cicle object
function Circle(position, velocity, radius, color, source) {
    this.position = position; // Circle position vector
    this.velocity = velocity; // Circle velocity vector
    this.radius = radius; // Circle radius
    this.color = color; // Circle base color
    this.source = source; // Circle image source

    // Draws circle on canvas
    this.draw = function() {
        c.beginPath();
        c.arc(this.position[0], this.position[1], this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        // Draws image in the middle of the circle
        c.drawImage(source, this.position[0]-this.radius+5, this.position[1]-this.radius+5, this.radius*2-10, this.radius*2-10);
    }

    this.update = function() {        
        this.draw();
        
        // Updates position and velocity if the animation isn't paused
        if (!paused) {
            // Checks for collision between circles
            for (let i = 0; i < circleArray.length; i++) {
                if (this === circleArray[i]) continue;
                // Resolves the collision between circles if they have collided
                if (distBetween(this.position, circleArray[i].position) - this.radius * 2 < 0) {
                    resolveCollision(this, circleArray[i]);
                }

            }

            // Checks for wall collision, if so flips velocity
            if (this.position[0] - this.radius <= 0 || this.position[0] + this.radius >= canvas.width) {
                this.velocity[0] = -this.velocity[0];
            }

            if (this.position[1] - this.radius <= 0 || this.position[1] + this.radius >= canvas.height) {
                this.velocity[1] = -this.velocity[1];
            }

            // Increments position by velocity
            this.position[0] += this.velocity[0];
            this.position[1] += this.velocity[1];
        }
    }
}

// Continuously updates cursor coordinates
window.addEventListener('mousemove', 
    function(event) {
        cursor[0] = event.x;
        cursor[1] = event.y;
        checkHover();
})

// Helper function that returns the distance between two positon vectors
function distBetween(vect1, vect2) {
    return Math.sqrt((vect1[0]-vect2[0])**2+(vect1[1]-vect2[1])**2);
}

// Helper function that rotates a vector by an angle, theta
function rotate(vect, theta) {
    var rotatedVect = [];
    rotatedVect[0] = vect[0]*Math.cos(theta) - vect[1]*Math.sin(theta);
    rotatedVect[1] = vect[0]*Math.sin(theta) + vect[1]*Math.cos(theta);
    return rotatedVect;
}

// Function that resolves the collision between circles, outputting their new velocity vectors
function resolveCollision(p1, p2) {
    if ((p1.velocity[0]-p2.velocity[0])*(p2.position[0]-p1.position[0]) + (p1.velocity[1]-p2.velocity[1])*(p2.position[1]-p1.position[1]) >= 0){
        // Angle between circles
        var theta = -Math.atan2(p2.position[1] - p1.position[1], p2.position[0] - p1.position[0]);

        // Rotate velocity vectors so they face each other
        var vInit1 = rotate(p1.velocity, theta);
        var vInit2 = rotate(p2.velocity, theta);

        // Switch x velocities due to 1D collision
        var vFin1 = [vInit2[0],vInit1[1]];
        var vFin2 = [vInit1[0],vInit2[1]]

        // Rotate the velocities back to normal
        vFin1 = rotate(vFin1, -theta);
        vFin2 = rotate(vFin2, -theta);

        // Change object velocities
        p1.velocity = vFin1;
        p2.velocity = vFin2;
    }   
}

// Checks if mouse is hovering over a circle
function checkHover() {
    var hovering = false;
    for (var i = 0; i < circleArray.length; i++) {
        if (distBetween(cursor, circleArray[i].position) < circleArray[i].radius) {
            // Changes display if a new circle is hovered over
            if (displayedID !== i) {
                displayedID = i;
                infoDisplayOn();
            }
            hovering = true;
            break;
        }
    }
    // Pauses animation if a circle is hovered over
    if (hovering){
        paused = true;
    }
    // Else turns of info panels and turns on animation
    else {
        paused = false;
        if (displayedID != undefined){
            infoDisplayOff();
        }
    }
}

// Displays info panel corresponding to hovered over circle
function infoDisplayOn() {
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('info-container').style.display = 'block';
    document.getElementById('link-container').style.display = 'block';
    infoDisplays[displayedID].style.display = 'flex';
    infoLinks[displayedID].style.display = 'block';
    // Changes position of info panel to left or right of screen depending on circle position
    if (circleArray[displayedID].position[0] < canvas.width/2) {
        document.getElementById('info-container').style.left = '57%';
        document.getElementById('link-container').style.left = '0';
    }
    else {
        document.getElementById('info-container').style.left = '3%';
        document.getElementById('link-container').style.left = '43%';
    }
}

// Turns of info display
function infoDisplayOff() {
    document.getElementById('main-container').style.display = 'block';
    document.getElementById('info-container').style.display = 'none';
    document.getElementById('link-container').style.display = 'none';
    infoDisplays[displayedID].style.display = 'none';  
    infoLinks[displayedID].style.display = 'none';  
    displayedID = undefined;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // Clears frame
    c.clearRect(0, 0, innerWidth, innerHeight);
    // Updates/redraws circles
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

var circleArray = [];
var circleRadius = canvas.height/13; // Default circle radius
var colors = ['#175676','#BA324F','#D62839','#4BA3C3']; // Possible circle colors
var numCircles = images.length; // Number of circles

// Creates and defines a circle for each project
for (var i = 0; i < numCircles; i++){
    var randPos = [(canvas.width-2*circleRadius)*Math.random()+circleRadius, (canvas.height-2*circleRadius)*Math.random()+circleRadius];
    var randVel = [(Math.random()+1)*(2*Math.round(Math.random())-1),(Math.random()+1)*(2*Math.round(Math.random())-1)];
    var randColor = colors[Math.floor(colors.length*Math.random())];
    for (var j = 0; j < circleArray.length; j++) {
        if (distBetween(randPos, circleArray[j].position) < circleRadius*2) {
            var randPos = [(canvas.width-2*circleRadius)*Math.random()+circleRadius, (canvas.height-2*circleRadius)*Math.random()+circleRadius];
            j = -1;
        }
    }
    circleArray.push(new Circle(randPos, randVel, circleRadius, randColor, images[i]));
}

// Begins animation loop
animate();