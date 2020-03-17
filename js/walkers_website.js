var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle object
function Particle(x, y, dx, dy) {
    this.x = x; // Position
    this.y = y;
    this.dx = dx; // Velocity
    this.dy = dy;
    this.radius = 2; // Radius
    this.color = "black"; // Color

    // Method that draws particle
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.radius, this.radius);
    }

    // Method that updates particle positon, velocity
    this.update = function() {
        var theta = noise.simplex3(this.x/scaleFactor,this.y/scaleFactor,t)*Math.PI; // Generates angle from noise field
        var velocityVect = angleToVector(vectorScale,2*theta); // Converts angle to velocity vector
        this.dx += velocityVect[0]; // Updates velocity
        this.dy += velocityVect[1];  
        this.x += this.dx; // Updates position
        this.y += this.dy;
        this.color = 'hsl('+(((t/0.0001))*(colorBound[1]-colorBound[0])+colorBound[0])+',100%,50%)'; // Updates color
        this.draw();
    }
}

// Helper function that changes an angle and radius to a vector
function angleToVector(r, theta) {
    return [r*Math.cos(theta),r*Math.sin(theta)];
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    iter += 1; // Increments iteration count
    t += 0.0000001; // Increments time
    if (iter < maxIter) { // Stops after maxIter
        for (var i = 0; i < particles.length; i++) {
            particles[i].update(); // Updates all particles
        }
    }
}

noise.seed(Math.random()); // Seed for noise field
c.globalAlpha = 0.2; // Opacity of points

var particles = []; // Particle array
var scaleFactor = 400; // Zoom
var vectorScale = 0.01; // Adjusts velocity vector
var maxIter = 1000; // Max iterations
var iter = 0; // Iteration count
var colorBound = [0,160]; // Color bounds (hsl hue)
var speedScale = 1.8; // Adjust starting speed range

var t = 0; // Time
var numParticles = 100; // Number of particles

// Creates particles
for (var i = 0; i < 2*Math.PI; i += Math.PI/2/numParticles) {
    particles.push(new Particle(canvas.width/2, canvas.height/2, speedScale*(2*Math.random()-1), speedScale*(2*Math.random()-1))); 
}

animate();
