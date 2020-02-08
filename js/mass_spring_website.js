var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

// Record interactive elements
var massSlider = document.getElementById("massslider");
var dampingSlider = document.getElementById("dampingslider");
var kSlider = document.getElementById("kslider");
var forceSlider = document.getElementById("forceslider");
var forceDisplay = document.getElementById("forcedisplay");

var springImg = document.getElementById("springImg");

var cursor = {
    x: undefined,
    y: undefined
}
var forceOption = 1; // Initial force function choice

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mass object
function MassSpring(xAbs, yAbs, width, stretchFactor, mass, dampingCoeff, springCoeff, u0, du0, forceFunction) {
    this.yAbs = yAbs; // Center y position
    this.stretchFactor = stretchFactor; // Intensity of spring movement
    this.width = width; // Box size
    this.m = mass; // Mass
    this.k = springCoeff; // Spring coeff
    this.gamma = dampingCoeff; // Damping coeff
    this.x = xAbs; // Center x position
    this.u = u0; // Initial speed
    this.v = du0; // Initial acceleration
    this.uPrev = u0; 
    this.vPrev = du0;
    this.t = 0; // Intitial t
    this.dt = 0.1; // Change in t per frame
    this.force = forceFunction; // Force function

    // Function that draws the mass
    this.draw = function() { 
        c.fillStyle = "rgb(102, 0, 7)";
        c.fillRect(this.x, this.yAbs - this.width/2 + this.stretchFactor * this.u, this.width, this.width);
    }

    // Function that updates the mass position 
    this.update = function() {
        // Update using Euler's
        this.u = this.uPrev + this.vPrev * this.dt;
        this.v = this.vPrev + (this.force(this.t) - this.k * this.uPrev - this.gamma * this.vPrev)/this.m * this.dt;
        this.t += this.dt;
        // Record values for Euler's 
        this.uPrev = this.u;
        this.vPrev = this.v;
        this.draw();
    }

}

// Event Listeners for sliders

massSlider.oninput = function() {
    mass1.m = this.value;
}

dampingSlider.oninput = function() {
    mass1.gamma = this.value;
}

kSlider.oninput = function() {
    mass1.k = this.value;
}

// Different possible forcing functions
forceSlider.oninput = function() {
    forceOption = this.value;
    if (forceOption == 0) {
        forceDisplay.innerHTML = "External Force Function (F(t) = 0)";
    }
    else if (forceOption == 1) {
        forceDisplay.innerHTML = "External Force Function (F(t) = 4000&Sigma;&delta;(t-50n))";
    }
    else if (forceOption == 2) {
        forceDisplay.innerHTML = "External Force Function (F(t) = 6cos(t))";
    }
    else if (forceOption == 3) {
        forceDisplay.innerHTML = "External Force Function (F(t) = 100&Sigma;(u<sub>n</sub>(t/50)-u<sub>n+1/2</sub>(t/50))";
    }
}

// Updates Cursor Coords
window.addEventListener('mousemove', 
    function(event) {
        cursor.x = event.x;
        cursor.y = event.y;
})

// Shows mass position preview
window.addEventListener('mousedown', 
    function(event) {
        if (cursor.y > 60) {
            showPrev = true;
        }
})

// Places mass when mouse is lifted
window.addEventListener('mouseup', 
    function(event) {
        showPrev = false;
        if (cursor.y > 60) {
            new_init(event.y);
        }
})

// Functions

// Change Cube Position, Velocity on MouseUp
function new_init(y) {
    mass1.uPrev = y - canvas.height/2;
    mass1.vPrev = 0;
}

// External Force Function
function force(t) {

    if (forceOption == 0) {
        return 0;
    }
    else if (forceOption == 1) {
        if (t % 50 < 0.1) {
            return 4000;
        }
        return 0;
    }
    else if (forceOption == 2) {
        return 6 * Math.cos(t);
    }
    else if (forceOption == 3) {
        if (t % 50 < 25) {
            return 100;
        }
        return 0;
    }

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    // Show release preview
    if (showPrev) {
        c.fillStyle = "rgb(102, 0, 7, 0.7)";
        c.fillRect(mass1.x, cursor.y - mass1.width/2, mass1.width, mass1.width);
    }
    
    // Record values for plot
    plot.unshift(mass1.yAbs - mass1.width/2 + mass1.stretchFactor * mass1.u);
    // Get rid of excess values
    if (plot.length > 1200) {
        plot.pop();
    }

    // Draw plot
    c.beginPath();
    c.strokeStyle = "white";
    c.moveTo(mass1.x + mass1.width/2, plot[0] + mass1.width/2);
    for (var i = 0; i < plot.length; i++) {
        c.lineTo(i + mass1.x + mass1.width, plot[i] + mass1.width/2);
    }
    c.stroke();

    mass1.update();

    // Draws spring support
    c.beginPath();
    c.moveTo(mass1.x, 120);
    c.lineTo(mass1.x + mass1.width, 120);
    c.stroke();
    
    // Draws spring & adjusts height
    c.drawImage(springImg, mass1.x, 120, mass1.width, mass1.yAbs - mass1.width/2 + mass1.stretchFactor * mass1.u - 120);
}

let plot = [];
let showPrev = false;

let mass1 = new MassSpring(100, canvas.height/2, 50, 1, 1.5, 0.5, 1, 0, 0, force);
animate();