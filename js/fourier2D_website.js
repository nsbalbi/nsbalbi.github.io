var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
var colors = ["red","green","blue","orange","yellow","purple"];

var numCirclesSlider = document.getElementById("num-circles-slider");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Object that generates each "circle"
function Vector(radius, speed, color) {
    this.x = canvas.width/2; // Initial center of circle
    this.y = canvas.height/2; // "
    this.radius = radius; // Circle radius
    this.speed = 1.5*speed; // Circle rotation speed
    this.radians = 0; // Current vector position
    this.color = color; // Circle color
    this.nextx; 
    this.nexty;

    // Function that draws the circle and the line from the center to the middle of the next circle
    this.draw = function() {
        c.beginPath();
        c.globalAlpha = 0.9; // Makes the circle slightly transparent
        c.strokeStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // Draws circle
        c.moveTo(this.x, this.y);
        this.nextx = this.x + this.radius * Math.cos(this.radians); // Calculates next circle position
        this.nexty = this.y + this.radius * Math.sin(this.radians); // "
        c.lineTo(this.nextx, this.nexty); // Draws line to next circle
        c.stroke();
        c.globalAlpha = 1;
    }

    this.update = function() {
        this.radians -= 1.5*this.speed; // Updates circle coords
        this.draw();
    }
}

// Updates numCircles when slider is used
numCirclesSlider.oninput = function() {
    numCircles = this.value;
    numCirclesSlider.parentElement.children[0].innerHTML = "Number of Circles: " + numCircles;
}

// Returns a random color from the color list
function randColor() {
    return colors[Math.floor(colors.length*Math.random())];
}

// Returns a random value between x and y
function randBetween(x, y) {
    return (y-x)*Math.random()+x;
}

// Resets the animation
function reset(newCircles) {
    circles = newCircles;
    plot = [];
}

// Generates random Fourier values
function randCircles() {
    var randCircles = [];
    randCircles.push(new Vector(120, -0.01, randColor()));
    for (var i = 2; i <= numCircles; i++) {
        randCircles.push(new Vector(randCircles[0].radius/(i+randBetween(-0.1,0.1)), i*0.005*randBetween(-2,2), randColor()));
    }
    return randCircles;
}

function preset_1() {
    var circles = [];
    circles.push(new Vector(150, 0.01, randColor()));
    for (var i = 2; i <= numCircles; i++) {
        circles.push(new Vector(circles[0].radius/(i), (2*i-1) * 0.01, randColor()));
    }
    return circles;
}

function preset_2() {
    var circles = [];
    circles.push(new Vector(150, 0.01, randColor()));
    for (var i = 2; i <= numCircles; i++) {
        circles.push(new Vector(circles[0].radius/(2*i-1), (2*i-1) * 0.01, randColor()));
    }
    return circles;
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < circles.length - 1; i++) {
        circles[i].update();
        circles[i+1].x = circles[i].nextx;
        circles[i+1].y = circles[i].nexty;
    }
    circles[circles.length - 1].update();

    plot.unshift(circles[circles.length - 1].nextx);
    plot.unshift(circles[circles.length - 1].nexty);
    if (plot.length > 800) {
        plot.pop();
    }

    c.beginPath();
    c.strokeStyle = "white";
    c.moveTo(circles[circles.length - 1].nextx, circles[circles.length - 1].nexty);
    for (var i = 0; i < plot.length; i+= 2) {
        c.lineTo(plot[i+1], plot[i]);
    }
    c.stroke();
}

c.lineWidth = 2;

var circles = [];
var plot = [];
var numCircles = 5;

reset(randCircles());

animate();