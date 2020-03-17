var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var numRefPointSlider = document.getElementById("num-ref-point-slider");
var ruleSlider = document.getElementById("rule-slider");
var distSlider = document.getElementById("dist-slider");
var randSlider = document.getElementById("random-slider");

// Point Object
function Point(x, y, color, edge, rule) {
    this.x = x; // x coord
    this.y = y; // y coord
    this.edge = edge; // Point size
    this.color = color; // Point color
    this.lastChoice = -1; // Last reference point chosen
    this.lastLastChoice = -1; // Second to last reference point 
    this.rule = rule; // Rule to follow

    // Draws point
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.edge, this.edge);
    }

    // Updates point location once following given rules
    // The point moves a certain relative distance to a reference point if it is chosen
    this.update = function() {
        var refPoint = Math.floor(randBetween(0,numRefPoints));
        // Next point can not be the same as the last
        if (rule == 1){
            while (this.lastChoice == refPoint) {
                var refPoint = Math.floor(randBetween(0,numRefPoints));
            }   
        }
        // Next point cannot be the rightward neighbor of the last
        if (rule == 2) {
            while (this.lastChoice + 1 == refPoint || (this.lastChoice == numRefPoints-1 && 0 == refPoint)) {
                var refPoint = Math.floor(randBetween(0,numRefPoints));
            }
        }
        // Next point cannot be two away from the last
        if (rule == 3){
            while (this.lastChoice + 2 == refPoint || this.lastChoice - 2 == refPoint) {
                var refPoint = Math.floor(randBetween(0,numRefPoints));
            }   
        }
        // Next point cannot neighbor the last if the last point has occured twice in a row
        if (rule == 4){
            while ((this.lastChoice + 1 == refPoint || this.lastChoice - 1 == refPoint || (this.lastChoice == numRefPoints-1 && 0 == refPoint) || (this.lastChoice == 0 && numRefPoints-1 == refPoint)) && this.lastLastChoice == this.lastChoice) {
                var refPoint = Math.floor(randBetween(0,numRefPoints));
            }   
        }
        this.lastLastChoice = this.lastChoice; // Saves last reference point
        this.lastChoice = refPoint; // Saves used reference point
        var newPoint = goTowards([this.x,this.y],[referencePoints[refPoint].x,referencePoints[refPoint].y,],distVar); // Calculates new point
        this.x = newPoint[0]; 
        this.y = newPoint[1];
        this.draw();
    }
}

// Slider handling
numRefPointSlider.oninput = function() {
    numRefPoints = this.value;
    numRefPointSlider.parentElement.children[0].innerHTML = "Number of Reference Points: " + numRefPoints;
}

ruleSlider.oninput = function() {
    rule = this.value;
    if (rule == 0){
        ruleSlider.parentElement.children[0].innerHTML = "Rule: Normal";
    }
    else if (rule == 1){
        ruleSlider.parentElement.children[0].innerHTML = "Rule: No Repeats";
    }
    else if (rule == 2){
        ruleSlider.parentElement.children[0].innerHTML = "Rule: No Right Neighbors";
    }
    else if (rule == 3){
        ruleSlider.parentElement.children[0].innerHTML = "Rule: No Neighbors Two Away";
    }
    else if (rule == 4){
        ruleSlider.parentElement.children[0].innerHTML = "Rule: No Neighbors if Two Repeats";
    }
}

distSlider.oninput = function() {
    distVar = this.value;
    distSlider.parentElement.children[0].innerHTML = "Step Size Ratio: " + distVar;
}

randSlider.oninput = function() {
    if (this.value == 0) {
        randPos = false;
        randSlider.parentElement.children[0].innerHTML = "Random Reference Points?:  False";
    }
    else {
        randPos = true;
        randSlider.parentElement.children[0].innerHTML = "Random Reference Points?:  True";
    }
}

// Returns a random number between x and y
function randBetween(x, y) {
    return (y-x)*Math.random()+x;
}

// Returns a random point within an arc of a circle if rand == true, evenly spaced points if rand == false
function randCirc(startRad, endRad, radius, rand) {
    var r = randBetween(0,radius);
    if (rand == false) {
        r = radius;
    }
    var theta = randBetween(startRad, endRad);
    if (rand == false) {
        theta = (startRad + endRad) / 2 ;
    }
    return [r*Math.cos(theta),r*Math.sin(theta)];
}

// Returns a point percent of the way from pos1 to pos2
function goTowards(pos1,pos2,percent) {
    return [pos1[0]+percent*(pos2[0]-pos1[0]),pos1[1]+percent*(pos2[1]-pos1[1])];
}

// Recalculates and draws points
function reset() {
    c.clearRect(0, 0, innerWidth, innerHeight);
    referencePoints = [];
    // Generates reference points along the edge of a circle
    // Spaced evenly if randPos == true, randomly in an arc if false
    for (var i = 0; i < numRefPoints; i++) {
        var newPoint = randCirc(i*2*Math.PI/numRefPoints,(i+1)*2*Math.PI/numRefPoints,canvas.height/2-100,randPos);
        referencePoints.push(new Point(newPoint[0]+canvas.width/2,newPoint[1]+canvas.height/2,"red",3,-1));
        referencePoints[i].draw();
    }
    point = new Point(canvas.width/2,canvas.height/2,"white",1,rule); // Main drawing point
    for (var i = 0; i < numIterations; i++) {
        point.update();
        point.color = 'hsl('+((i**(2))/(numIterations**(2))*60)+',100%,50%)'; // Color changes over time
    }
}

var numRefPoints = 3; // Current number of reference points
var numIterations = 100000; // Number of iterations on main point
var distVar = 0.5; // Fractional distance moved each turn
var rule = 0; // Current rule
var randPos = false; // Random reference points or no

var referencePoints = [];
var point;

reset();
